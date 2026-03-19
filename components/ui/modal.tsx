"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

export default function Modal({
  open,
  close,
  children,
  title,
  panelClassName,
}: PropsWithChildren<{
  open: boolean;
  close: () => void;
  title?: ReactNode;
  panelClassName?: string;
}>) {
  return (
    <Transition show={open}>
      <Dialog className="relative z-50" onClose={close}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={cn(
                  "relative overflow-hidden rounded-2xl max-sm:w-full bg-[#050505] px-6 pb-5 pt-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6",
                  panelClassName,
                )}
              >
                {title && (
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 mb-4">
                    <DialogTitle className="text-lg font-medium font-poppins text-white tracking-[0.18em] uppercase">
                      {title}
                    </DialogTitle>
                    <Button
                      onClick={close}
                      className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:text-white"
                      variant="ghost"
                      type="button"
                    >
                      <X size={16} weight="bold" />
                    </Button>
                  </div>
                )}
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
