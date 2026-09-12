export function SamplesExamTable() {
  return (
    <table
      className="w-full border-collapse text-sm"
      data-testid="samples-exam-table"
    >
      <thead>
        <tr className="text-left text-[var(--ink-muted)]">
          <th className="border border-[var(--line)] px-3 py-2">样品</th>
          <th className="border border-[var(--line)] px-3 py-2">质量 / g</th>
          <th className="border border-[var(--line)] px-3 py-2">体积 / cm³</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-[var(--line)] px-3 py-2">甲</td>
          <td className="border border-[var(--line)] px-3 py-2">79</td>
          <td className="border border-[var(--line)] px-3 py-2">10</td>
        </tr>
        <tr>
          <td className="border border-[var(--line)] px-3 py-2">乙</td>
          <td className="border border-[var(--line)] px-3 py-2">6</td>
          <td className="border border-[var(--line)] px-3 py-2">10</td>
        </tr>
      </tbody>
    </table>
  );
}
