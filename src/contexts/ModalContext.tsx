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

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "center" | "top";
  closeOnBackdrop?: boolean;
};

type ModalState =
  | { kind: "none" }
  | { kind: "confirm"; opts: ConfirmOptions; resolve: (v: boolean) => void }
  | { kind: "node"; node: ReactNode };

type Ctx = {
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
  alert: (opts: Omit<ConfirmOptions, "cancelText">) => Promise<void>;
  openNode: (node: ReactNode) => void; // 직접 노드 주입
  openComponent: <T, P extends { onClose: (value?: T) => void }>(
    Comp: ComponentType<P>,
    props: Omit<P, "onClose"> & {
      size?: "sm" | "md" | "lg" | "xl";
      align?: "center" | "top";
      closeOnBackdrop?: boolean;
    },
  ) => Promise<T | undefined>; // 결과 반환형
  close: () => void;
};

const ModalContext = createContext<Ctx | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ kind: "none" });

  const close = useCallback(() => setState({ kind: "none" }), []);

  const confirm = useCallback((opts: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) =>
      setState({ kind: "confirm", opts, resolve }),
    );
  }, []);

  const alert = useCallback(
    async (opts: Omit<ConfirmOptions, "cancelText">) => {
      await confirm({ ...opts, cancelText: undefined });
    },
    [confirm],
  );

  const openNode = useCallback(
    (node: ReactNode) => setState({ kind: "node", node }),
    [],
  );

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
              onClose={() => resolve(undefined)}
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

  const value = useMemo<Ctx>(
    () => ({ confirm, alert, openNode, openComponent, close }),
    [confirm, alert, openNode, openComponent, close],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {state.kind === "confirm" && (
        <Dialog
          open
          size={state.opts.size ?? "sm"}
          align={state.opts.align ?? "center"}
          closeOnBackdrop={state.opts.closeOnBackdrop ?? true}
        >
          <Dialog.Header>
            <Dialog.Title>{state.opts.title ?? "확인"}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {state.opts.description && (
              <p style={{ color: "var(--color-gray-900)" }}>
                {state.opts.description}
              </p>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            {state.opts.cancelText !== undefined && (
              <button
                type="button"
                onClick={() => {
                  state.resolve(false);
                  close();
                }}
              >
                {state.opts.cancelText ?? "취소"}
              </button>
            )}
            <button
              type="button"
              style={{
                background: state.opts.danger
                  ? "var(--color-red-400)"
                  : "var(--color-footer)",
                color: "#fff",
                borderRadius: 8,
                padding: "8px 14px",
              }}
              onClick={() => {
                state.resolve(true);
                close();
              }}
            >
              {state.opts.confirmText ?? "확인"}
            </button>
          </Dialog.Footer>
        </Dialog>
      )}
      {state.kind === "node" && state.node}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
