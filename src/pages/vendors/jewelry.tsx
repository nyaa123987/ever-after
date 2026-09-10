import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { jewelry } from "../../data/jewelry";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Jewelry" category="jewelry" vendors={jewelry} />
    </ProtectedPage>
  );
}
