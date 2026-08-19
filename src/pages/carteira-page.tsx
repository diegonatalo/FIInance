import { FiiForm } from "../components/fii-form";
import { FiiTable } from "../components/fii-table";
import { Card, CardTitle } from "../components/ui/card";
import { useCarteiraContext } from "../contexts/carteira-context";

export function CarteiraPage() {
  const { ativos, totalInvestido, onAdd, onEdit, onDelete } =
    useCarteiraContext();

  return (
    <>
      <Card>
        <CardTitle className="mb-4">Adicionar ativo</CardTitle>
        <FiiForm onSubmit={onAdd} />
      </Card>

      <Card>
        <CardTitle className="mb-4">Meus ativos</CardTitle>
        <FiiTable
          ativos={ativos}
          total={totalInvestido}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </>
  );
}
