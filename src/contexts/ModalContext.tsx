import {
  type ComponentType,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Dialog } from "../components/molecules";
import ConfirmDialogContent from "../components/molecules/ConfirmDialogContent/ConfirmDialogContent";
import type { ConfirmDialogContentProps } from "../types/modal";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string; // undefined면 OK만 노출
  danger?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "center" | "top";
  closeOnBackdrop?: boolean;
};

type ModalState = { kind: "none" } | { kind: "node"; node: ReactNode };

type Ctx = {
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
  alert: (opts: Omit<ConfirmOptions, "cancelText">) => Promise<void>;
  openNode: (node: ReactNode) => void;
  openComponent: <T, P extends { onClose: (value?: T) => void }>(
    Comp: ComponentType<P>,
    props: Omit<P, "onClose"> & {
      size?: "sm" | "md" | "lg" | "xl";
      align?: "center" | "top";
      closeOnBackdrop?: boolean;
    },
  ) => Promise<T | undefined>;
  close: () => void;
};

const ModalContext = createContext<Ctx | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ kind: "none" });

  const close = useCallback(() => setState({ kind: "none" }), []);

  const openNode = useCallback((node: ReactNode) => {
    setState({ kind: "node", node });
  }, []);

  const openComponent = useCallback(
    <T, P extends { onClose: (v?: T) => void }>(
      Comp: ComponentType<P>,
      props: Omit<P, "onClose"> & {
        size?: "sm" | "md" | "lg" | "xl";
        align?: "center" | "top";
        closeOnBackdrop?: boolean;
      },
    ) => {
      return new Promise<T | undefined>((resolve) => {
        const {
          size = "md",
          align = "center",
          closeOnBackdrop = true,
          ...rest
        } = props as Omit<P, "onClose"> & {
          size?: "sm" | "md" | "lg" | "xl";
          align?: "center" | "top";
          closeOnBackdrop?: boolean;
        };

        setState({
          kind: "node",
          node: (
            <Dialog
              open
              size={size}
              align={align}
              closeOnBackdrop={closeOnBackdrop}
              onClose={() => {
                resolve(undefined);
                close();
              }}
            >
              <Comp
                {...({
                  ...(rest as Omit<
                    P,
                    "onClose" | "size" | "align" | "closeOnBackdrop"
                  >),
                  onClose: (val?: T) => {
                    resolve(val);
                    close();
                  },
                } as P)}
              />
            </Dialog>
          ),
        });
      });
    },
    [close],
  );

  const confirm = useCallback(
    (opts: ConfirmOptions = {}) => {
      const {
        size = "sm",
        align = "center",
        closeOnBackdrop = true,
        ...rest
      } = opts;
      return openComponent<boolean, ConfirmDialogContentProps>(
        ConfirmDialogContent,
        {
          ...(rest as ConfirmDialogContentProps),
          size,
          align,
          closeOnBackdrop,
        },
      ).then((v) => !!v);
    },
    [openComponent],
  );

  const alert = useCallback(
    (opts: Omit<ConfirmOptions, "cancelText">) =>
      confirm({ ...opts, cancelText: undefined }).then(() => undefined),
    [confirm],
  );

  const value = useMemo<Ctx>(
    () => ({ confirm, alert, openNode, openComponent, close }),
    [confirm, alert, openNode, openComponent, close],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {state.kind === "node" && state.node}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
