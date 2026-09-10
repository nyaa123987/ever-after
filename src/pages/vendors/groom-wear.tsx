import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { groomWear } from "../../data/groom-wear";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Groom Wear" category="groom-wear" vendors={groomWear} />
    </ProtectedPage>
  );
}
