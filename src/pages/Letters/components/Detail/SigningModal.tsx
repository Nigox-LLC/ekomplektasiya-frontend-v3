import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Table } from "antd";
import { toast } from "react-toastify";
import webSocketService from "@/service/webSocket";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks";
import {
  setEimzoRememberedCert,
  setEimzoSigningData,
} from "@/store/slices/infoSlice";
import { axiosAPI } from "@/service/axiosAPI";
import type { Executor } from "@/components/CreatAboveModal";
import {
  saveEimzoCert,
  getSavedEimzoCert,
  saveEimzoSigningData,
  getSavedEimzoSigningData,
  type SavedEimzoCert,
} from "@/utils/eimzoStorage";

interface CertificateRaw {
  disk: string;
  path: string;
  name: string;
  alias: string;
}

interface CertificateParsed extends CertificateRaw {
  cn?: string;
  firstName?: string;
  lastName?: string;
  validFrom?: string;
  validTo?: string;
}

interface CertificateDetails {
  plugin: "pfx";
  name: "load_key";
  arguments: string[];
}

interface EImzoSigningProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  documentId?: string; // Imzolanadigan hujjat ID si
  orderFileID?: number; // Imzolanadigan fayl ID si (agar kerak bo'lsa)
  onSignSuccess?: (response: any) => void; // Muvaffaqiyatli imzolash callback
  templateID?: number;
  deadline?: string;
  executors?: Executor[];
}

// Utility functions
function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const parseAlias = (alias: string) => {
  const info: Record<string, string> = {};
  alias.split(",").forEach((part) => {
    const [key, value] = part.split("=");
    if (key && value) info[key.trim().toLowerCase()] = value.trim();
  });
  return {
    cn: capitalizeWords(info["cn"]) || "",
    firstName: capitalizeWords(info["name"]) || "",
    lastName: capitalizeWords(info["surname"]) || "",
    validFrom: info["validfrom"] || "",
    validTo: info["validto"] || "",
  };
};

const parseEimzoDate = (s?: string | null) => {
  if (!s) return null;
  const cleaned = s.trim().replace(/\./g, "-");
  const [d, t = "00:00:00"] = cleaned.split(/\s+/);
  const [Y, M, D] = (d || "").split("-").map((n) => parseInt(n, 10));
  const [h = 0, m = 0, sec = 0] = (t || "")
    .split(":")
    .map((n) => parseInt(n, 10));
  if ([Y, M, D].some(Number.isNaN)) return null;
  return new Date(Y, (M || 1) - 1, D || 1, h, m, sec);
};

const isExpired = (validTo?: string | null) => {
  const dt = parseEimzoDate(validTo);
  return dt ? dt.getTime() < Date.now() : false;
};

type PendingAction = "sign" | "remember" | null;

const EImzoSigning: React.FC<EImzoSigningProps> = ({
  isOpen,
  onClose,
  onCancel,
  documentId,
  onSignSuccess,
  orderFileID,
  templateID,
  deadline,
  executors,
}) => {
  // State management
  const [certificates, setCertificates] = useState<CertificateParsed[]>([]);
  const [selectedCertRow, setSelectedCertRow] =
    useState<CertificateParsed | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateDetails | null>(null);
  const [keyId, setKeyId] = useState<string>("");
  const [signingLoading, setSigningLoading] = useState(false);
  const [showSavedConfirm, setShowSavedConfirm] = useState(false);

  // Redux
  const dispatch = useAppDispatch();
  const savedCert = useAppSelector((state) => state.info.eimzoRememberedCert);
  const savedSigningData = useAppSelector(
    (state) => state.info.eimzoSigningData,
  );

  // Refs
  const selectedCertRef = useRef<CertificateParsed | null>(null);
  const initSentRef = useRef(false);
  const apiKeyAcceptedRef = useRef(false);
  const signingInFlightRef = useRef(false);
  const keyLoadedRef = useRef(false);
  const pkcs7DataRef = useRef<string | null>(null);
  const rememberKeyFlowRef = useRef(false);

  const pendingActionRef = useRef<PendingAction>(null);

  const executorsRef = useRef(executors);
  const deadlineRef = useRef(deadline);
  const templateIDRef = useRef(templateID);
  const orderFileIDRef = useRef(orderFileID);

  // Load saved cert and signing data from localStorage on mount
  useEffect(() => {
    const loadedCert = getSavedEimzoCert();
    const loadedSigningData = getSavedEimzoSigningData();

    if (loadedCert && !savedCert) {
      dispatch(setEimzoRememberedCert(loadedCert));
    }

    if (loadedSigningData && !savedSigningData) {
      dispatch(setEimzoSigningData(loadedSigningData));
    }
  }, []);

  // Update refs when props change
  useEffect(() => {
    executorsRef.current = executors;
    deadlineRef.current = deadline;
    templateIDRef.current = templateID;
    orderFileIDRef.current = orderFileID;
  }, [executors, deadline, templateID, orderFileID]);

  // Reset state
  const resetState = useCallback(() => {
    setCertificates([]);
    setSelectedCertRow(null);
    setSelectedCertificate(null);
    setKeyId("");
    setSigningLoading(false);
    setShowSavedConfirm(false);

    signingInFlightRef.current = false;
    pendingActionRef.current = null;
    rememberKeyFlowRef.current = false;

    selectedCertRef.current = null;
    keyLoadedRef.current = false;
    apiKeyAcceptedRef.current = false;
    pkcs7DataRef.current = null;
  }, []);

  // Backendga imzolash so'rovini yuborish
  const handleSignDocument = useCallback(
    async (pkcs7_64: string) => {
      if (!documentId) {
        toast.error("Hujjat ID si topilmadi!", { closeButton: false });
        return;
      }

      setSigningLoading(true);

      try {
        const payload: any = {
          signature: pkcs7_64,
          certificateInfo: {
            disk: selectedCertRef.current?.disk,
            path: selectedCertRef.current?.path,
            name: selectedCertRef.current?.name,
            alias: selectedCertRef.current?.alias,
            cn: selectedCertRef.current?.cn,
            validFrom: selectedCertRef.current?.validFrom,
            validTo: selectedCertRef.current?.validTo,
          },
        };

        if (orderFileIDRef.current)
          payload.order_file_id = orderFileIDRef.current;
        if (templateIDRef.current) payload.template = templateIDRef.current;

        if (deadlineRef.current) payload.deadline = deadlineRef.current;
        if (executorsRef.current) payload.executers = [...executorsRef.current];

        const response = await axiosAPI.post(
          `document/orders/${documentId}/signing/`,
          payload,
        );

        if (response.status === 200) {
          toast.success("Hujjat muvaffaqiyatli imzolandi!", {
            autoClose: 3000,
          });

          dispatch(
            setEimzoSigningData({
              pkcs7_64,
              documentId,
              signedAt: new Date().toISOString(),
            }),
          );

          if (onSignSuccess) {
            onSignSuccess(response.data);
          }
        }

        handleCancel();
      } catch (error: any) {
        console.error("Sign document error:", error);
        toast.error(
          error.response?.data?.message ||
            "Hujjatni imzolashda xatolik yuz berdi!",
          { closeButton: false },
        );
      } finally {
        setSigningLoading(false);
        signingInFlightRef.current = false;
        pendingActionRef.current = null;
      }
    },
    [documentId, dispatch, onSignSuccess],
  );

  const saveRememberedCert = useCallback(() => {
    const cert = selectedCertRef.current;
    if (!cert) return;

    const payload = {
      disk: cert.disk,
      path: cert.path,
      name: cert.name,
      alias: cert.alias,
      cn: cert.cn,
      validFrom: cert.validFrom,
      validTo: cert.validTo,
    };

    // Save to localStorage
    saveEimzoCert(payload);

    // Save to Redux
    dispatch(setEimzoRememberedCert(payload));

    toast.success("Kalit muvaffaqiyatli eslab qolindi", { autoClose: 2000 });
  }, [dispatch]);

  // WebSocket and initialization effect
  useEffect(() => {
    if (!isOpen) {
      webSocketService.disconnect();
      resetState();
      initSentRef.current = false;
      return;
    }

    webSocketService.connect(
      "wss://127.0.0.1:64443/service/cryptapi",
      (msg: any) => {
        try {
          const parsed = JSON.parse(msg);

          // Step 1: API key accepted -> list certificates
          if (
            parsed.success === true &&
            !apiKeyAcceptedRef.current &&
            !parsed.certificates &&
            !parsed.keyId &&
            !parsed.pkcs7_64
          ) {
            apiKeyAcceptedRef.current = true;
            webSocketService.sendMessage(
              JSON.stringify({
                plugin: "pfx",
                name: "list_all_certificates",
              }),
            );
          }
          // Step 2: Handle certificate list response
          else if (parsed.certificates && parsed.success) {
            const parsedCerts: CertificateParsed[] = [];
            parsed.certificates.forEach((cert: CertificateRaw) => {
              if (cert.alias.includes("cn=")) {
                const certItem = {
                  ...cert,
                  ...parseAlias(cert.alias),
                };
                parsedCerts.push(certItem);
              }
            });

            setCertificates(parsedCerts);

            // Auto-restore saved certificate (faqat tanlab qo'yamiz, parol oynasi bu yerda ochilmaydi)
            if (savedCert && parsedCerts.length > 0) {
              const matchedCert = parsedCerts.find(
                (c) => c.name === savedCert.name && c.disk === savedCert.disk,
              );
              if (matchedCert && !isExpired(matchedCert.validTo)) {
                selectedCertRef.current = matchedCert;
                setSelectedCertRow(matchedCert);
                setSelectedCertificate({
                  plugin: "pfx",
                  name: "load_key",
                  arguments: [
                    matchedCert.disk,
                    matchedCert.path,
                    matchedCert.name,
                    matchedCert.alias,
                  ],
                });
                toast.info("Saqlangan kalit avtomatik tanlandi", {
                  autoClose: 2000,
                });
              }
            }
          }
          // Step 3: Handle keyId response from load_key
          else if (
            parsed.keyId &&
            parsed.type === "PFX_KEY_STORE" &&
            parsed.success
          ) {
            setKeyId(parsed.keyId);
            keyLoadedRef.current = true;

            // Agar hozir "sign" yoki "remember" jarayoni boshlangan bo'lsa:
            // create_pkcs7 chaqiramiz -> bu E-IMZO parol oynasini chiqaradi
            if (signingInFlightRef.current && pendingActionRef.current) {
              webSocketService.sendMessage(
                JSON.stringify({
                  plugin: "pkcs7",
                  name: "create_pkcs7",
                  arguments: ["Test", parsed.keyId, "no"],
                }),
              );
            }
          }
          // Step 4: Handle pkcs7 creation response (parol oynasidan keyin)
          else if (parsed.pkcs7_64 && parsed.success) {
            pkcs7DataRef.current = parsed.pkcs7_64;

            // Qaysi action ekanini tekshiramiz
            if (pendingActionRef.current === "sign") {
              handleSignDocument(parsed.pkcs7_64);
              return;
            }

            if (pendingActionRef.current === "remember") {
              // Parol to'g'ri -> endi kalitni saqlaymiz
              saveRememberedCert();

              // Save pkcs7 data to both Redux and localStorage for future use
              dispatch(setEimzoSigningData(parsed.pkcs7_64));
              saveEimzoSigningData(parsed.pkcs7_64);

              // remember jarayonini yakunlaymiz (modal yopilmaydi)
              signingInFlightRef.current = false;
              pendingActionRef.current = null;
              rememberKeyFlowRef.current = false;
              setSigningLoading(false);
              setShowSavedConfirm(true);
              return;
            }
          }
          // Handle errors
          else if (parsed.success === false) {
            toast.error(parsed.reason || "E-IMZO xatolik!", {
              closeButton: false,
            });
            setSigningLoading(false);
            signingInFlightRef.current = false;
            pendingActionRef.current = null;
          }
        } catch (error) {
          console.error("WebSocket parse error:", error);
        }
      },
    );

    return () => {
      webSocketService.disconnect();
    };
  }, [isOpen, resetState, savedCert, handleSignDocument, saveRememberedCert]);

  // Initialize E-IMZO connection
  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setInterval(() => {
      if (!initSentRef.current && webSocketService.isConnected()) {
        webSocketService.sendMessage(
          JSON.stringify({
            name: "apikey",
            arguments: [
              "null",
              "E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D",
              "localhost",
              "96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B",
              "127.0.0.1",
              "A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F",
              "test.e-imzo.uz",
              "DE783306B4717AFE4AE1B185E1D967C265AA397A35D8955C7D7E38A36F02798AA62FBABE2ABA15C888FE2F057474F35A5FC783D23005E4347A3E34D6C1DDBAE5",
              "test.e-imzo.local",
              "D56ABC7F43A23466D9ADB1A2335E7430FCE0F46B0EC99B578D554333245FC071357AE9E7E2F75F96B73AEEE7E0D61AE84E414F5CD795D8B6484E5645CAF958FC",
            ],
          }),
        );

        initSentRef.current = true;
        window.clearInterval(timer);
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, [isOpen]);

  // Handle confirm button - imzolash
  const handleConfirm = (cert?: SavedEimzoCert | null) => {
    if (!selectedCertificate && !cert) {
      toast.error("Iltimos, sertifikatni tanlang!", { closeButton: false });
      return;
    }

    if (!webSocketService.isConnected() && !cert) {
      toast.error("E-IMZO bilan aloqa yo'q. Iltimos, biroz kuting.", {
        closeButton: false,
      });
      return;
    }

    // If using saved cert with cached signature
    if (cert && savedSigningData) {
      handleSignDocument(savedSigningData);
      return;
    }

    pendingActionRef.current = "sign";
    signingInFlightRef.current = true;

    // Agar key allaqachon yuklangan bo'lsa, to'g'ridan-to'g'ri create_pkcs7 chaqiramiz
    if (keyLoadedRef.current && keyId) {
      webSocketService.sendMessage(
        JSON.stringify({
          plugin: "pkcs7",
          name: "create_pkcs7",
          arguments: ["Test", keyId, "no"],
        }),
      );
    } else {
      // Avval kalitni yuklaymiz, keyin ws keyId qaytgach create_pkcs7 ishlaydi
      keyLoadedRef.current = false;
      webSocketService.sendMessage(JSON.stringify(selectedCertificate));
    }
  };

  // Handle remember key (parol oynasi chiqadi -> to'g'ri bo'lsa saqlaydi)
  const handleRememberKey = () => {
    if (!selectedCertRef.current || !selectedCertificate) {
      toast.error("Iltimos, sertifikatni tanlang!", { closeButton: false });
      return;
    }
    if (isExpired(selectedCertRef.current.validTo)) {
      toast("Bu kalitning muddati tugagan, saqlab bo'lmaydi.", {
        type: "warning",
      });
      return;
    }
    if (!webSocketService.isConnected()) {
      toast.error("E-IMZO bilan aloqa yo'q. Iltimos, biroz kuting.", {
        closeButton: false,
      });
      return;
    }

    // "Remember" jarayonini boshlaymiz
    rememberKeyFlowRef.current = true;
    pendingActionRef.current = "remember";
    signingInFlightRef.current = true;
    setSigningLoading(true);

    if (keyLoadedRef.current && keyId) {
      // Key yuklangan -> bevosita parol oynasini ochamiz
      webSocketService.sendMessage(
        JSON.stringify({
          plugin: "pkcs7",
          name: "create_pkcs7",
          arguments: ["Test", keyId, "no"],
        }),
      );
    } else {
      // Key yuklanmagan -> load_key yuboramiz (keyId qaytgach create_pkcs7 avtomatik ketadi)
      keyLoadedRef.current = false;
      webSocketService.sendMessage(JSON.stringify(selectedCertificate));
    }
  };

  // Handle cancel/close
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
    webSocketService.disconnect();
    resetState();
  };

  // Handle certificate selection
  const handleCertificateSelect = (record: CertificateParsed) => {
    if (isExpired(record.validTo)) {
      toast("Bu kalitning muddati tugagan, tanlab bo'lmaydi.", {
        type: "warning",
      });
      return;
    }

    selectedCertRef.current = record;
    setSelectedCertRow(record);
    setSelectedCertificate({
      plugin: "pfx",
      name: "load_key",
      arguments: [record.disk, record.path, record.name, record.alias],
    });

    // Reset showSavedConfirm if selecting a different cert
    if (savedCert?.name !== record.name) {
      setShowSavedConfirm(false);
    }

    // Show confirmation if this is the saved cert
    if (savedCert?.name === record.name && savedSigningData) {
      setShowSavedConfirm(true);
      toast.info(
        "Saqlangan kalit tanlandi. Imzolash tasdiqlash orqali davom etadi.",
        { autoClose: 3000 },
      );
    }

    // Reset state when new cert is selected
    setKeyId("");
    keyLoadedRef.current = false;
  };

  return (
    <Modal
      title={
        showSavedConfirm && savedCert
          ? "Saqlangan E-IMZO kaliti"
          : "E-IMZO kalitini tanlang"
      }
      open={isOpen}
      onCancel={handleCancel}
      width={900}
      footer={
        showSavedConfirm && savedCert
          ? [
              <Button
                key="cancel"
                onClick={handleCancel}
                disabled={signingLoading}
              >
                Bekor qilish
              </Button>,
              <Button
                key="ok"
                type="primary"
                loading={signingLoading}
                onClick={() => handleConfirm(savedCert)}
              >
                Imzolash
              </Button>,
            ]
          : [
              <Button
                key="cancel"
                onClick={handleCancel}
                disabled={signingLoading}
              >
                Chiqish
              </Button>,
              <Button
                key="remember"
                onClick={handleRememberKey}
                disabled={signingLoading || !selectedCertificate}
              >
                Kalitni eslab qolish
              </Button>,
              <Button
                key="ok"
                type="primary"
                loading={signingLoading}
                disabled={!selectedCertificate}
                onClick={() => handleConfirm(null)}
              >
                Imzolash
              </Button>,
            ]
      }
    >
      {showSavedConfirm && savedCert ? (
        <div className="space-y-3 text-sm text-gray-700">
          <p>Siz belgilangan kalit orqali imzolashni tasdiqlaysizmi?</p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="font-medium text-slate-900">
              {savedCert.cn || savedCert.name}
            </div>
            <div className="text-xs text-slate-600">
              {savedCert.validFrom || ""}{" "}
              {savedCert.validTo ? `- ${savedCert.validTo}` : ""}
            </div>
          </div>
        </div>
      ) : (
        <Table
          rowKey="name"
          dataSource={certificates}
          pagination={false}
          loading={certificates.length === 0 && !initSentRef.current}
          locale={{
            emptyText: (
              <div
                style={{
                  textAlign: "center",
                  color: "red",
                  fontWeight: "bold",
                  fontSize: "18px",
                  padding: "20px 0",
                }}
              >
                E-IMZO moduli bilan ulanishda xatolik! <br />
                Modulni{" "}
                <a
                  href="https://e-imzo.soliq.uz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "red", textDecoration: "underline" }}
                >
                  shu yerdan
                </a>{" "}
                kompyuteringizga o'rnating va qayta urinib ko'ring.
              </div>
            ),
          }}
          rowClassName={(record: CertificateParsed) =>
            isExpired(record.validTo)
              ? "bg-red-50 text-red-600"
              : selectedCertRow?.name === record.name
                ? "bg-blue-50"
                : ""
          }
          rowSelection={{
            type: "radio",
            selectedRowKeys: selectedCertRow ? [selectedCertRow.name] : [],
            getCheckboxProps: (record: CertificateParsed) => ({
              disabled: isExpired(record.validTo),
              title: isExpired(record.validTo)
                ? "Muddati tugagan — tanlab bo'lmaydi"
                : undefined,
            }),
          }}
          onRow={(record: CertificateParsed) => ({
            onClick: () => handleCertificateSelect(record),
          })}
          columns={[
            { title: "Disk", dataIndex: "disk", key: "disk", width: 80 },
            {
              title: "Joylashuvi",
              dataIndex: "path",
              key: "path",
              width: 200,
            },
            { title: "F.I.O", dataIndex: "cn", key: "cn", width: 200 },
            {
              title: "Amal qilish muddati",
              width: 250,
              render: (_, r: CertificateParsed) => {
                const expired = isExpired(r.validTo);
                return (
                  <span className={expired ? "text-red-600 font-semibold" : ""}>
                    {r.validFrom} - {r.validTo}
                    {expired && <span className="ml-2">(muddati tugagan)</span>}
                  </span>
                );
              },
            },
            {
              title: "Holat",
              width: 150,
              render: (_, r: CertificateParsed) => {
                const isSaved =
                  savedCert?.name === r.name && savedCert?.disk === r.disk;
                return isSaved ? (
                  <span className="text-green-600 text-xs">
                    ✓ Kalit saqlangan
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">
                    Kalit saqlanmagan
                  </span>
                );
              },
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default EImzoSigning;
