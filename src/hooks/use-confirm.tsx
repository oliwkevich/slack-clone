import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

export const useConfirm = (): {
  ConfrimDialog: () => React.JSX.Element;
  confirm: () => Promise<unknown>;
} => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => new Promise((resolve) => setPromise({ resolve }));
  const handleClose = () => setPromise(null);

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfrimDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ви впевнені що хочете продовжити?</DialogTitle>
          <DialogDescription>
            Цю дію неможливо буде відмінити!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Відмінити
          </Button>
          <Button onClick={handleConfirm}>Продовжити</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { ConfrimDialog, confirm };
};
