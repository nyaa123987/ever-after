import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { cakeDesigners } from "../../data/cake-designers";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Cake Designers" category="cake-designers" vendors={cakeDesigners} />
    </ProtectedPage>
  );
}
