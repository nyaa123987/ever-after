import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { invitations } from "../../data/invitations";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Invitations" category="invitations" vendors={invitations} />
    </ProtectedPage>
  );
}
