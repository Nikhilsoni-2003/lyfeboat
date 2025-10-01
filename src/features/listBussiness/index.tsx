import { Button } from "@/components/ui/button";
import ListBusinessSheet from "@/features/listBussiness/components/ListBusinessSheet";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface initialStateI {
  isOpen: boolean;
}

interface ListBussinessFeatProps {
  refetch?: () => void;
}

const initialState: initialStateI = {
  isOpen: false,
};

const ListBussinessFeat: React.FC<ListBussinessFeatProps> = ({ refetch }) => {
  const [state, setState] = useState<initialStateI>(initialState);
  const context = useRouteContext({ from: "__root__" });
  const { useUserStore } = context;
  const { isLoggedIn, isProfileCompleted } = useUserStore();
  const navigate = useNavigate();

  const onOpen = () => {
    setState((prev) => ({ ...prev, isOpen: true }));
  };

  const onClose = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const listBussiness = () => {
    if (!isLoggedIn) {
      toast.info("Kindly login to list business", {
        action: {
          label: "Visit",
          onClick: () => navigate({ to: "/login" }),
        },
      });
      return;
    }
    if (!isProfileCompleted && isLoggedIn) {
      toast.info("Kindly complete profile to list business", {
        action: {
          label: "Visit",
          onClick: () => navigate({ to: "/profile" }),
        },
      });
      return;
    }
    onOpen();
  };

  return (
    <>
      <Button onClick={listBussiness}>
        <Plus className="w-6 h-6" />
        List Your Business
      </Button>
      <ListBusinessSheet
        isOpen={state.isOpen}
        closeModal={onClose}
        refetch={refetch}
      />
    </>
  );
};

export default ListBussinessFeat;
