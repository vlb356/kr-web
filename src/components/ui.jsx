// Pequeños componentes reutilizables (estilos tailwind)
import React from "react";

export function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50 " +
        className
      }
      {...props}
    />
  );
}

export function Badge({ className = "", children }) {
  return (
    <span className={"px-2 py-0.5 text-xs rounded-full border " + className}>
      {children}
    </span>
  );
}

export function Card({ className = "", children }) {
  return (
    <div className={"border rounded-2xl p-4 bg-white shadow-sm " + className}>
      {children}
    </div>
  );
}
