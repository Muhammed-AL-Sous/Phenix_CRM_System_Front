import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";
import { useUpdateProfileMutation } from "../../users/usersApiSlice";
import { notifySonner } from "../../../lib/notifySonner";
import { Spinner } from "../../../components/common/SpinnerFallback";

const ProfilePage = () => {
  const user = useSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ id: user.id, ...formData }).unwrap();
      notifySonner("auth:success.profile_updated", "success");
    } catch (_error) {
      notifySonner("auth:error.update_failed", "error");
    }
  };

  return (
    <div className="profile-page">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          disabled
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
