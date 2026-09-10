import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { musicians } from "../../data/musicians";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Musicians" category="musicians" vendors={musicians} />
    </ProtectedPage>
  );
}
