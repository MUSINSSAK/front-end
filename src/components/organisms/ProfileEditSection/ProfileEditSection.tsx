import {
  AccountSecurity,
  AddressSection,
  ProfileSection,
} from "../../molecules";
import styles from "./ProfileEditSection.module.css";

export default function ProfileEditSection() {
  return (
    <div className={styles.wrapper}>
      <ProfileSection />
      <AddressSection />
      <AccountSecurity />
    </div>
  );
}
