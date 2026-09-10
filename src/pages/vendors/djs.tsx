import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { djs } from "../../data/djs";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="DJs" category="djs" vendors={djs} />
    </ProtectedPage>
  );
}
