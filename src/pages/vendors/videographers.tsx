import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { videographers } from "../../data/videographers";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Videographers" category="videographers" vendors={videographers} />
    </ProtectedPage>
  );
}
