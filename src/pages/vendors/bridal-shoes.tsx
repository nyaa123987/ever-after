import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { bridalShoes } from "../../data/bridal-shoes";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Bridal Shoes" category="bridal-shoes" vendors={bridalShoes} />
    </ProtectedPage>
  );
}
