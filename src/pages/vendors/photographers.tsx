import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { photographers } from "../../data/photographers";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Photographers" category="photographers" vendors={photographers} />
    </ProtectedPage>
  );
}
