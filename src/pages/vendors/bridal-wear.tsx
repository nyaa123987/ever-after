import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { bridalWear } from "../../data/bridal-wear";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Bridal Wear" category="bridal-wear" vendors={bridalWear} />
    </ProtectedPage>
  );
}
