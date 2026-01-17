"use client";

import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

/**
 * React component for managing code copy functionality on a page.
 * This component injects copy buttons into all <pre> blocks containing code snippets.
 * When a button is clicked, the corresponding code is copied to the clipboard.
 *
 * @function CodeCopyManager
 * @returns {null} This component does not render any visible elements.
 */
export function CodeCopyManager(): React.JSX.Element | null {
  const pathname = usePathname();

  useEffect(() => {
    const copyIconFull = renderToStaticMarkup(<IconCopy size={16} />);
    const checkIconFull = renderToStaticMarkup(<IconCheck size={16} />);

    /**
     * Injects copy buttons into all <pre> blocks on the page.
     * Each button allows users to copy the code inside the <pre> block.
     */
    const injectButtons = () => {
      const preBlocks = document.querySelectorAll("pre");

      preBlocks.forEach((pre) => {
        if (pre.querySelector(".copy-button")) return; // Skip if button already exists

        const button = document.createElement("button");
        button.className = "copy-button";
        button.setAttribute("aria-label", "Copier le code");
        button.innerHTML = copyIconFull;

        pre.appendChild(button);

        button.addEventListener("click", async () => {
          const code = pre.querySelector("code");
          if (!code) return;

          // Extract only the text content of code lines, ignoring line numbers
          const lines = code.querySelectorAll("[data-line]");
          const textToCopy =
            lines.length > 0
              ? Array.from(lines)
                  .map((line) => line.textContent)
                  .join("\n")
              : code.innerText;

          try {
            await navigator.clipboard.writeText(textToCopy);
            button.innerHTML = checkIconFull;
            button.classList.add("success");

            setTimeout(() => {
              button.innerHTML = copyIconFull;
              button.classList.remove("success");
            }, 2000);
          } catch (err) {
            console.error("Échec de la copie", err);
          }
        });
      });
    };

    // Initial scan to inject buttons
    injectButtons();

    /**
     * Observes the DOM for changes and reinjects buttons if new <pre> blocks are added.
     */
    const observer = new MutationObserver(() => {
      injectButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, [pathname]);

  return null;
}
