import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { florists } from "../../data/florists";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Florists" category="florists" vendors={florists} />
    </ProtectedPage>
  );
}
