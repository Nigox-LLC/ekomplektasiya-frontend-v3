import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Modal, Table, Checkbox } from "antd";
import { toast } from "react-toastify";
import { axiosAPI } from "@/service/axiosAPI";
import webSocketService from "@/service/webSocket";
import { type SavedEimzoCert } from "@/utils/eimzoStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks";
import {
  clearEimzoRememberedCert,
  setEimzoRememberedCert,
  setEimzoSigningData,
} from "@/store/slices/infoSlice";

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

interface SigningPayload {
  document_name: string;
  id: string;
  data: any;
  number: string;
}

interface EImzoSigningProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  documentId: string;
  onSuccess: () => void;
  orderType?: "district" | "region" | "republic";
  documentName?: string;
  fileEndpoint?: string;
  mode?: "sign" | "setup";
  documentType?: "price_analysis";
}

// E-IMZO parol saqlash komponenti
interface PasswordCacheProps {
  certificateId: string;
  onPasswordSave: (password: string) => void;
  onPasswordLoad: () => Promise<string | null>;
  onPasswordClear: () => void;
}

const EImzoPasswordCache: React.FC<PasswordCacheProps> = ({
  certificateId,
  onPasswordSave,
  onPasswordLoad,
  onPasswordClear,
}) => {
  const [rememberPassword, setRememberPassword] = useState(false);
  const [passwordLoaded, setPasswordLoaded] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCachedPassword = async () => {
      try {
        const cachedPassword = await onPasswordLoad();
        if (cachedPassword && passwordInputRef.current) {
          passwordInputRef.current.value = cachedPassword;
          setPasswordLoaded(true);
          toast.info("Saqlangan parol yuklandi", { autoClose: 2000 });
        }
      } catch (error) {
        console.error("Parolni yuklashda xatolik:", error);
      }
    };

    if (certificateId) {
      loadCachedPassword();
    }
  }, [certificateId, onPasswordLoad]);

  const handleRememberChange = (e: any) => {
    const checked = e.target.checked;
    setRememberPassword(checked);

    if (!checked) {
      // Agar eslab qolish o'chirilsa, parolni tozalash
      onPasswordClear();
      if (passwordInputRef.current) {
        passwordInputRef.current.value = "";
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    if (rememberPassword && password) {
      onPasswordSave(password);
    }
  };

  return (
    <div className="password-cache-container">
      <input
        ref={passwordInputRef}
        type="password"
        placeholder="E-IMZO parolini kiriting"
        className="ant-input"
        style={{ marginBottom: "10px" }}
        onChange={handlePasswordChange}
      />
      <Checkbox checked={rememberPassword} onChange={handleRememberChange}>
        Parolni 6 soat eslab qolish
      </Checkbox>
      {passwordLoaded && (
        <div className="text-green-600 text-xs mt-1">
          ✓ Saqlangan parol yuklandi
        </div>
      )}
    </div>
  );
};

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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

const resolveFileUrl = (rawUrl: string) => {
  if (!rawUrl) return "";

  if (/^https?:\/\//i.test(rawUrl)) {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.origin !== window.location.origin) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      return rawUrl;
    }
    return rawUrl;
  }

  const base = axiosAPI.defaults.baseURL || window.location.origin;
  let origin = window.location.origin;
  try {
    origin = new URL(base).origin;
  } catch {
    origin = window.location.origin;
  }
  return new URL(rawUrl, origin).toString();
};

const EImzoSigning: React.FC<EImzoSigningProps> = ({
  isOpen,
  onClose,
  onCancel,
  documentId,
  onSuccess,
  orderType = "district",
  documentName = "ЗаявкаПоРайонам",
  fileEndpoint,
  mode = "sign",
  documentType,
}) => {
  const [certificates, setCertificates] = useState<CertificateParsed[]>([]);
  const [selectedCertRow, setSelectedCertRow] =
    useState<CertificateParsed | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateDetails | null>(null);
  const selectedCertRef = useRef<CertificateParsed | null>(null);
  const [keyID, setKeyID] = useState("");
  const [messageFileBinary, setMessageFileBinary] = useState<string | null>(
    null,
  );
  const [signingLoading, setSigningLoading] = useState(false);
  const dispatch = useAppDispatch();
  const savedCert = useAppSelector((state) => state.info.eimzoRememberedCert);
  const savedSigningData = useAppSelector(
    (state) => state.info.eimzoSigningData,
  );
  const [showSavedConfirm, setShowSavedConfirm] = useState(false);
  const [signingData, setSigningData] = useState<SigningPayload>({
    document_name: documentName,
    number: "",
    id: documentId,
    data: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const initSentRef = useRef(false);
  const passwordRequestRef = useRef(false);
  const pkcs7RequestedRef = useRef(false);
  const signingSentRef = useRef(false);
  const signingInFlightRef = useRef(false);
  const rememberKeyFlowRef = useRef(false);

  const openPasswordModal = useCallback(() => {
    setShowPasswordModal(true);
    passwordRequestRef.current = true;
  }, []);

  const isReadyToSign = useMemo(() => {
    return Boolean(selectedCertificate);
  }, [selectedCertificate]);

  const resetState = useCallback(() => {
    setCertificates([]);
    setSelectedCertRow(null);
    setSelectedCertificate(null);
    setKeyID("");
    setMessageFileBinary(null);
    setSigningLoading(false);
    setShowSavedConfirm(false);
    setShowPasswordModal(false);
    setPassword("");
    setRememberPassword(false);
    setSigningData((prev) => ({
      ...prev,
      id: documentId,
      data: "",
      number: "",
      document_name: documentName,
    }));
    passwordRequestRef.current = false;
    pkcs7RequestedRef.current = false;
    signingSentRef.current = false;
    signingInFlightRef.current = false;
    rememberKeyFlowRef.current = false;
  }, [documentId, documentName]);

  const fetchDocumentBinary = useCallback(async () => {
    if (mode === "setup") return;
    if (!documentId) return;
    try {
      const orderPrefix =
        orderType === "region"
          ? "region-orders"
          : orderType === "republic"
            ? "republic-orders"
            : "district-orders";
      const resolvedEndpoint = fileEndpoint
        ? fileEndpoint.replace("{id}", documentId)
        : `${orderPrefix}/${documentId}/order-file/`;
      const response = await axiosAPI.get(resolvedEndpoint);
      const fileUrl = response.data.file_url;
      const fileName = (fileUrl.split("/").pop() || "").trim();
      const number = fileName ? fileName.replace(/\.[^/.]+$/, "") : "";
      setSigningData((prev) => ({
        ...prev,
        id: documentId,
        number,
        document_name: documentName,
      }));

      const resolvedUrl = resolveFileUrl(fileUrl);
      const res = await fetch(resolvedUrl);
      const arrayBuffer = await res.arrayBuffer();
      setMessageFileBinary(arrayBufferToBase64(arrayBuffer));
    } catch (error) {
      console.error("Document fetch error:", error);
      toast.error("Hujjatni olishda xatolik yuz berdi!", {
        closeButton: false,
      });
    }
  }, [documentId, documentName, mode, orderType]);

  const signingDocument = useCallback(async () => {
    if (signingInFlightRef.current) return;
    signingInFlightRef.current = true;
    if (documentType === "price_analysis") {
      try {
        setSigningLoading(true);
        const response = await axiosAPI.post(
          "signing/upload-price-analysis",
          signingData,
        );
        if (response.status === 200) {
          toast.success("Hujjat imzolandi", { closeButton: false });
          onSuccess();
          onClose();
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Imzolashda xatolik!", {
          closeButton: false,
        });
        webSocketService.disconnect();
      } finally {
        setSigningLoading(false);
        webSocketService.disconnect();
        signingInFlightRef.current = false;
      }
    } else {
      try {
        setSigningLoading(true);
        const response = await axiosAPI.post("signing/upload", signingData);
        if (response.status === 200) {
          toast.success("Hujjat imzolandi", { closeButton: false });
          onSuccess();
          onClose();
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Imzolashda xatolik!", {
          closeButton: false,
        });
        webSocketService.disconnect();
      } finally {
        setSigningLoading(false);
        webSocketService.disconnect();
        signingInFlightRef.current = false;
      }
    }
  }, [onClose, onSuccess, signingData]);

  useEffect(() => {
    if (!isOpen) {
      webSocketService.disconnect();
      resetState();
      initSentRef.current = false;
      return;
    }

    setShowSavedConfirm(false);

    fetchDocumentBinary();

    webSocketService.connect(
      "wss://127.0.0.1:64443/service/cryptapi",
      (msg: any) => {
        try {
          const parsed = JSON.parse(msg);

          if (parsed.certificates) {
            const parsedCerts: CertificateParsed[] = [];
            parsed.certificates.map((cert: CertificateRaw) => {
              if (cert.alias.includes("cn=")) {
                const certItem = {
                  ...cert,
                  cn: parseAlias(cert.alias).cn,
                  firstName: parseAlias(cert.alias).firstName,
                  lastName: parseAlias(cert.alias).lastName,
                  validFrom: parseAlias(cert.alias).validFrom,
                  validTo: parseAlias(cert.alias).validTo,
                };
                parsedCerts.push(certItem);
              }
            });
            setCertificates([...parsedCerts]);
          } else if (parsed.name === "need_password") {
            // Parol talab qilinganda
            openPasswordModal();
          } else if (parsed.name === "bad_password") {
            // Noto'g'ri parol
            toast.error("Noto'g'ri parol! Iltimos, qayta kiriting.", {
              closeButton: false,
            });
            openPasswordModal();
          } else if (parsed.keyId) {
            setKeyID(parsed.keyId);
          } else if (parsed.pkcs7_64) {
            if (rememberKeyFlowRef.current) {
              if (selectedCertRef.current) {
                const cert = selectedCertRef.current;
                dispatch(
                  setEimzoRememberedCert({
                    disk: cert.disk,
                    path: cert.path,
                    name: cert.name,
                    alias: cert.alias,
                    cn: cert.cn,
                    validFrom: cert.validFrom,
                    validTo: cert.validTo,
                  }),
                );
              }
              dispatch(setEimzoSigningData(parsed));
              rememberKeyFlowRef.current = false;
              setShowSavedConfirm(true);
              toast.success("Kalit eslab qolindi", { autoClose: 2000 });
              return;
            }
            // Store parsed data in state for signing flow
            if (mode === "setup") {
              console.log(parsed);
            }
            setSigningData((prev) => ({
              ...prev,
              data: parsed,
            }));
          }
        } catch (error) {
          console.error("WebSocket parse error:", error);
        }
      },
    );

    return () => {
      webSocketService.disconnect();
    };
  }, [
    fetchDocumentBinary,
    isOpen,
    resetState,
    savedCert,
    savedSigningData,
    onSuccess,
    onClose,
    mode,
    openPasswordModal,
  ]);

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

        webSocketService.sendMessage(
          JSON.stringify({
            plugin: "pfx",
            name: "list_all_certificates",
          }),
        );

        initSentRef.current = true;
        window.clearInterval(timer);
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (mode !== "sign") return;
    if (keyID && messageFileBinary && !pkcs7RequestedRef.current) {
      pkcs7RequestedRef.current = true;
      signingSentRef.current = false;
      webSocketService.sendMessage(
        JSON.stringify({
          plugin: "pkcs7",
          name: "create_pkcs7",
          arguments: [messageFileBinary, keyID, "no"],
        }),
      );
    }
  }, [keyID, messageFileBinary, mode]);

  useEffect(() => {
    if (mode !== "sign") return;
    if (signingData.data && !signingSentRef.current) {
      signingSentRef.current = true;
      signingDocument();
    }
  }, [mode, signingData.data, signingDocument]);

  const handleConfirm = (cert?: SavedEimzoCert | null) => {
    if (!selectedCertificate && !cert) {
      toast.error("Iltimos, sertifikatni tanlang!", { closeButton: false });
      return;
    }

    if (!webSocketService.isConnected()) {
      toast.error("E-IMZO bilan aloqa yo'q. Iltimos, biroz kuting.", {
        closeButton: false,
      });
      return;
    }

    pkcs7RequestedRef.current = false;
    signingSentRef.current = false;

    if (cert) {
      if (!savedSigningData) {
        toast.error("Saqlangan imzo ma'lumoti topilmadi.", {
          closeButton: false,
        });
        return;
      }
      signingSentRef.current = false;
      setSigningData((prev) => ({
        ...prev,
        data: savedSigningData,
      }));
      return;
    }

    if (selectedCertificate) {
      if (
        savedCert?.name === selectedCertRef.current?.name &&
        savedSigningData
      ) {
        setShowSavedConfirm(true);
        return;
      }
      webSocketService.sendMessage(JSON.stringify(selectedCertificate));
      // Saqlangan parolni yuklash
      if (selectedCertRef.current) {
        if (
          savedCert?.name === selectedCertRef.current.name &&
          savedSigningData
        ) {
          signingSentRef.current = false;
          setSigningData((prev) => ({
            ...prev,
            data: savedSigningData,
          }));
        } else {
          openPasswordModal();
        }
      }
    }
  };

  const handleRememberKey = () => {
    if (!selectedCertRef.current || !selectedCertificate) {
      toast.error("Iltimos, sertifikatni tanlang!", { closeButton: false });
      return;
    }
    if (!webSocketService.isConnected()) {
      toast.error("E-IMZO bilan aloqa yo'q. Iltimos, biroz kuting.", {
        closeButton: false,
      });
      return;
    }
    rememberKeyFlowRef.current = true;
    pkcs7RequestedRef.current = false;
    signingSentRef.current = false;
    webSocketService.sendMessage(JSON.stringify(selectedCertificate));
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      toast.error("Iltimos, parolni kiriting!", { closeButton: false });
      return;
    }

    // E-IMZO ga parolni yuborish
    webSocketService.sendMessage(
      JSON.stringify({
        name: "password",
        arguments: [password],
      }),
    );

    setShowPasswordModal(false);
    setPassword("");
    passwordRequestRef.current = false;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
    webSocketService.disconnect();
    resetState();
    if (mode === "setup") {
      dispatch(clearEimzoRememberedCert());
    }
  };

  return (
    <>
      <Modal
        title={
          showSavedConfirm && savedCert
            ? "Saqlangan E-IMZO kaliti"
            : "E-IMZO maxfiy raqamini kiriting!"
        }
        open={isOpen}
        onCancel={handleCancel}
        style={{ minWidth: "800px" }}
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
                  disabled={signingLoading || !isReadyToSign}
                >
                  Kalitni eslab qolish
                </Button>,
                <Button
                  key="ok"
                  type="primary"
                  loading={signingLoading}
                  disabled={!isReadyToSign}
                  onClick={() => handleConfirm(null)}
                >
                  {mode === "setup" ? "Tasdiqlash" : "Imzolash"}
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
                  E-IMZO modulini bilan ulanishda xatolik! <br />
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
              onClick: () => {
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
                  arguments: [
                    `${record.disk}`,
                    `${record.path}`,
                    `${record.name}`,
                    `${record.alias}`,
                  ],
                });

                if (savedCert?.name !== record.name) {
                  setShowSavedConfirm(false);
                }

                if (savedCert?.name === record.name) {
                  toast.info(
                    "Saqlangan kalit tanlandi. Imzolash tasdiqlash orqali davom etadi.",
                    {
                      autoClose: 3000,
                    },
                  );
                }
              },
            })}
            columns={[
              { title: "Disk", dataIndex: "disk", key: "disk" },
              { title: "Joylashuvi", dataIndex: "path", key: "path" },
              { title: "F.I.O", dataIndex: "cn", key: "cn" },
              {
                title: "Amal qilish muddati",
                render: (_, r: CertificateParsed) => {
                  const expired = isExpired(r.validTo);
                  return (
                    <span
                      className={expired ? "text-red-600 font-semibold" : ""}
                    >
                      {r.validFrom} - {r.validTo}
                      {expired && (
                        <span className="ml-2">(muddati tugagan)</span>
                      )}
                    </span>
                  );
                },
              },
              {
                title: "Parol holati",
                render: (_, r: CertificateParsed) => {
                  return savedCert?.name === r.name ? (
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
    </>
  );
};

export default EImzoSigning;
