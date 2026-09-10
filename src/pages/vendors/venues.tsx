import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { venues } from "../../data/venues";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Venues" category="venues" vendors={venues} />
    </ProtectedPage>
  );
}
