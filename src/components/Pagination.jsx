"use client"

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className={page === 0 ? "btn-secondary opacity-50 cursor-not-allowed" : "btn-secondary"}
      >
        Oldingi
      </button>

      <div className="flex gap-2">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum = i
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              style={{
                backgroundColor: page === pageNum ? "#5CAB7A" : "#F3F4F6",
                color: page === pageNum ? "#FFFFFF" : "#374151",
              }}
              className="px-3 py-2 rounded font-medium"
            >
              {pageNum + 1}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className={page >= totalPages - 1 ? "btn-secondary opacity-50 cursor-not-allowed" : "btn-secondary"}
      >
        Keyingi
      </button>
    </div>
  )
}
