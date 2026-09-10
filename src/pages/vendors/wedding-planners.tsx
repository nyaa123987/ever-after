import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { weddingPlanners } from "../../data/wedding-planners";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Wedding Planners" category="wedding-planners" vendors={weddingPlanners} />
    </ProtectedPage>
  );
}
