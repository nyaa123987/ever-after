import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { groomShoes } from "../../data/groom-shoes";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Groom Shoes" category="groom-shoes" vendors={groomShoes} />
    </ProtectedPage>
  );
}
