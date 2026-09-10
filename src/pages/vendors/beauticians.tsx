import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { beauticians } from "../../data/beauticians";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Beauticians" category="beauticians" vendors={beauticians} />
    </ProtectedPage>
  );
}
