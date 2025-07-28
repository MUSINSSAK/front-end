import { createContext, type ReactNode, useContext, useState } from "react";

type CategoryCtx = {
  selected: string;
  setSelected: (c: string) => void;
};

const CategoryContext = createContext<CategoryCtx | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string>("");
  return (
    <CategoryContext.Provider value={{ selected, setSelected }}>
      {children}
    </CategoryContext.Provider>
  );
}
export function useCategory() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategory must be inside Provider");
  return ctx;
}
