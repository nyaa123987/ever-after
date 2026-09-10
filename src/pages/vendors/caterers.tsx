import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { caterers } from "../../data/caterers";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Caterers" category="caterers" vendors={caterers} />
    </ProtectedPage>
  );
}
