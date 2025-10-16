import { useAllBusinesses } from "../../hooks/useAllBusinesses";
import { ApprovalTable } from "./components/ApprovalTable";

const AdminDashboard = () => {
  const { data: allBusinesses, refetch } = useAllBusinesses();

  return (
    <>
      {allBusinesses && (
        <>
          <div className="container mx-auto h-screen flex flex-col">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-balance">
                Approval Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage and track approval requests
              </p>
            </div>

            <div className="flex-1 overflow-auto">
              <ApprovalTable data={allBusinesses} refetch={refetch} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
