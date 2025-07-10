export class ToastSystem {
  constructor() {
    this.container = null;
    this.position = "top-right";
    this.toasts = [];
    this.styles = null;
    this.init();
  }

  init() {
    this.injectStyles();
    this.createContainer();
  }

  injectStyles() {
    if (document.getElementById("toast-styles")) return;

    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
            /* Toast Container */
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }


            /* Toast Styles */
            .toast {
                background: #333;
                color: white;
                padding: 16px 20px;
                border-radius: 6px;
                margin-bottom: 10px;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: space-between;
                pointer-events: auto;
                position: relative;
                overflow: hidden;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .toast.show {
                opacity: 1;
                transform: translateX(0);
            }

            .toast.hide {
                opacity: 0;
                transform: translateX(100%);
                margin-bottom: 0;
                padding-top: 0;
                padding-bottom: 0;
                min-height: 0;
            }

            /* Toast from left */
            .toast-container.top-left .toast,
            .toast-container.bottom-left .toast {
                transform: translateX(-100%);
            }

            .toast-container.top-left .toast.show,
            .toast-container.bottom-left .toast.show {
                transform: translateX(0);
            }

            .toast-container.top-left .toast.hide,
            .toast-container.bottom-left .toast.hide {
                transform: translateX(-100%);
            }

            /* Toast from center */
            .toast-container.top-center .toast,
            .toast-container.bottom-center .toast {
                transform: translateY(-100%);
            }

            .toast-container.top-center .toast.show,
            .toast-container.bottom-center .toast.show {
                transform: translateY(0);
            }

            .toast-container.top-center .toast.hide,
            .toast-container.bottom-center .toast.hide {
                transform: translateY(-100%);
            }  

            /* Toast Content */
            .toast-content {
                display: flex;
                align-items: center;
                flex: 1;
            }

            .toast-icon {
                margin-right: 12px;
                font-size: 18px;
            }

            .toast-message {
                flex: 1;
            }

            .toast-title {
                font-weight: bold;
                margin-bottom: 4px;
                font-size: 14px;
            }

            .toast-text {
                font-size: 14px;
                opacity: 0.9;
                line-height: 1.4;
            }

            /* Close Button */
            .toast-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                margin-left: 12px;
                opacity: 0.7;
                transition: opacity 0.2s;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .toast-close:hover {
                opacity: 1;
            }

            /* Progress Bar */
            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255,255,255,0.3);
                transition: width linear;
            }

            /* Toast Types */
            .toast.toast-success {
                background: #28a745;
            }

            .toast.toast-error {
                background: #dc3545;
            }

            .toast.toast-warning {
                background: #ffc107;
                color: #333;
            }

            .toast.toast-warning .toast-close {
                color: #333;
            }

            .toast.toast-info {
                background: #17a2b8;
            }

            .toast.toast-dark {
                background: #343a40;
            }

            .toast.toast-light {
                background: #f8f9fa;
                color: #333;
                border: 1px solid #dee2e6;
            }

            .toast.toast-light .toast-close {
                color: #333;
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .toast-container {
                    left: 10px !important;
                    right: 10px !important;
                    top: 10px !important;
                    bottom: 10px !important;
                    transform: none !important;
                }

                .toast {
                    min-width: auto;
                    max-width: none;
                }
            }
        `;

    document.head.appendChild(style);
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.className = `toast-container ${this.position}`;
    document.body.appendChild(this.container);
  }

  show(
    message,
    title = null,
    type = "default",
    duration = 4000,
    showProgress = false
  ) {
    const toast = this.createToast(
      message,
      title,
      type,
      duration,
      showProgress
    );
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add("show");
      });
    });

    // Auto hide (if duration is set)
    if (duration > 0) {
      this.scheduleHide(toast, duration, showProgress);
    }

    return toast;
  }

  createToast(message, title, type, duration, showProgress) {
    const toast = document.createElement("div");
    toast.className = `toast ${type !== "default" ? "toast-" + type : ""}`;

    const icon = this.getIcon(type);

    const closeButton = document.createElement("button");
    closeButton.className = "toast-close";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => this.hide(toast));

    toast.innerHTML = `
            <div class="toast-content">
                ${icon ? `<div class="toast-icon">${icon}</div>` : ""}
                <div class="toast-message">
                    ${
                      title
                        ? `<div class="toast-title">${this.escapeHtml(
                            title
                          )}</div>`
                        : ""
                    }
                    <div class="toast-text">${this.escapeHtml(message)}</div>
                </div>
            </div>
            ${
              showProgress && duration > 0
                ? '<div class="toast-progress"></div>'
                : ""
            }
        `;

    toast.appendChild(closeButton);

    return toast;
  }

  getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || "";
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  scheduleHide(toast, duration, showProgress) {
    if (showProgress) {
      const progressBar = toast.querySelector(".toast-progress");
      if (progressBar) {
        progressBar.style.width = "100%";
        progressBar.style.transitionDuration = duration + "ms";
        requestAnimationFrame(() => {
          progressBar.style.width = "0%";
        });
      }
    }

    setTimeout(() => {
      this.hide(toast);
    }, duration);
  }

  hide(toast) {
    if (!toast || toast.classList.contains("hide")) return;

    toast.classList.add("hide");
    toast.classList.remove("show");

    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 300);
  }

  // Convenience methods
  success(message, duration = 4000, title = null) {
    return this.show(message, title, "success", duration);
  }

  error(message, duration = 4000, title = null) {
    return this.show(message, title, "error", duration);
  }

  warning(message, duration = 4000, title = null) {
    return this.show(message, title, "warning", duration);
  }

  info(message, duration = 4000, title = null) {
    return this.show(message, title, "info", duration);
  }

  // Clear all toasts
  clear() {
    this.toasts.forEach((toast) => this.hide(toast));
  }

  // Destroy the toast system
  destroy() {
    this.clear();
    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    const styles = document.getElementById("toast-styles");
    if (styles) {
      styles.remove();
    }
  }
}
