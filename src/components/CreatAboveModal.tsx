import { Button, Radio } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";
import EmployeeSelectModal from "./EmployeeSelectModal/EmployeeSelectModal";

type Executor = {
  id: number;
  full_name: string;
  position_name: string | null;
  department?: string | null;
};

interface ExecutorCardProps {
  executor: Executor;
  isMain: boolean;
  onDelete: (id: number) => void;
}

const ExecutorCard = React.memo(
  ({ executor, isMain, onDelete }: ExecutorCardProps) => (
    <div
      className={`flex items-center gap-3 p-4 border rounded-lg shadow-sm hover:shadow-md transition-all bg-white ${
        isMain ? "border-green-400 bg-green-50" : "border-gray-200"
      }`}
    >
      <Radio value={executor.id} className="flex-shrink-0" />
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isMain ? "bg-green-100" : "bg-blue-100"
        }`}
      >
        <UserOutlined
          className={`text-lg ${isMain ? "text-green-600" : "text-blue-600"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {executor.full_name}
          {isMain && (
            <span className="ml-2 text-xs text-green-600 font-semibold">
              (Asosiy)
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {executor.position_name ||
            executor.department ||
            "Lavozim ko'rsatilmagan"}
        </p>
      </div>
      <button
        onClick={() => onDelete(executor.id)}
        className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
        title="O'chirish"
      >
        <DeleteOutlined className="text-base" />
      </button>
    </div>
  ),
);

interface IProps {
  setShowCreateAboveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatAboveModal: React.FC<IProps> = ({ setShowCreateAboveModal }) => {
  const [executors, setExecutors] = React.useState<Executor[]>([]);
  const [mainExecutorId, setMainExecutorId] = React.useState<number | null>(
    null,
  );
  const [showSelectEmployeeModal, setShowSelectEmployeeModal] =
    React.useState(false);

  const handleDeleteExecutor = React.useCallback((executorId: number) => {
    setExecutors((prev) => prev.filter((executor) => executor.id !== executorId));
    setMainExecutorId((prev) => (prev === executorId ? null : prev));
  }, []);

  const handleSetMainExecutor = React.useCallback((executorId: number) => {
    setMainExecutorId(executorId);
  }, []);

  const executorCards = React.useMemo(
    () =>
      executors.map((executor) => (
        <ExecutorCard
          key={executor.id}
          executor={executor}
          isMain={mainExecutorId === executor.id}
          onDelete={handleDeleteExecutor}
        />
      )),
    [executors, mainExecutorId, handleDeleteExecutor],
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg min-w-165">
          <div className="flex items-start justify-between gap-6">
            <h2 className="text-xl font-semibold mb-4">
              Usti xat yaratish oynasi
            </h2>
            <span
              className="cursor-pointer text-3xl"
              onClick={() => setShowCreateAboveModal(false)}
            >
              &times;
            </span>
          </div>

          {/* Body section */}
          <div className="mb-4">
            {/* executors section */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-medium mb-2">
                  Ijrochilar
                  {mainExecutorId && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Asosiy ijrochi belgilangan)
                    </span>
                  )}
                </h3>
                <Button
                  onClick={() => setShowSelectEmployeeModal(true)}
                  className="mb-2"
                >
                  + Ijrochilarni tanlash
                </Button>
              </div>

              {/* list of executors */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <Radio.Group
                  onChange={(event) => handleSetMainExecutor(event.target.value)}
                  value={mainExecutorId}
                  className="grid! grid-cols-1! sm:grid-cols-1! lg:grid-cols-2! xl:grid-cols-3! gap-3!"
                >
                  {executorCards}
                </Radio.Group>

                {executors.length === 0 && (
                  <div className="flex items-center justify-center h-28 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500">
                    Ijrochilar tanlanmagan
                  </div>
                )}
              </div>
            </div>

            {/* deadline section */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Muddati</h3>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* button actions - footer */}
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowCreateAboveModal(false)}
                className="px-4 py-2"
              >
                Bekor qilish
              </Button>
              <Button type="primary" className="px-4 py-2">
                Yaratish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showSelectEmployeeModal && (
        <EmployeeSelectModal
          onClose={() => setShowSelectEmployeeModal(false)}
          onSelect={(employees) => {
            setShowSelectEmployeeModal(false);
            setExecutors(employees);
          }}
          selectedEmployeeIds={executors.map((executor) => executor.id)}
          selectionType="multiple"
        />
      )}
    </>
  );
};

export default CreatAboveModal;
