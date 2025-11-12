import { useTranslation } from "react-i18next"
import "./ErrorMessage.css"

export default function ErrorMessage({ message, onClose }) {
  const { t } = useTranslation()

  return (
    <div className="error-message">
      <span>⚠️ {message || t("common.error")}</span>
      {onClose && (
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      )}
    </div>
  )
}
