import ProtectedPage from "../../components/ProtectedPage";
import VendorCategoryPage from "../../components/VendorCategoryPage";
import { rentalServices } from "../../data/rental-services";

export default function Page() {
  return (
    <ProtectedPage>
      <VendorCategoryPage title="Rental Services" category="rental-services" vendors={rentalServices} />
    </ProtectedPage>
  );
}
