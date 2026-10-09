export function Pagination({ meta, onChange }) {
    if (!meta || meta.totalPages <= 1) return null;
    return (
      <div className="pagination">
        <button disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}>Previous</button>
        <span className="muted">Page {meta.page} of {meta.totalPages}</span>
        <button disabled={meta.page >= meta.totalPages} onClick={() => onChange(meta.page + 1)}>Next</button>
      </div>
    );
  }