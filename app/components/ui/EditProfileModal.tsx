import { useState } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    username: string;
    fullName: string;
  };
  onUpdate: (data: {
    username: string;
    fullName: string;
    oldPassword: string;
    newPassword: string;
  }) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdate,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    username: currentUser.username,
    fullName: currentUser.fullName,
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onUpdate(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка при обновлении профиля");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 max-[380px]:p-2">
      <div className="bg-white rounded-lg p-4 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto max-[380px]:p-3">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 max-[380px]:text-lg max-[380px]:mb-3">
          Редактировать профиль
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm sm:text-base max-[380px]:px-2 max-[380px]:py-1.5 max-[380px]:text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 max-[380px]:space-y-2">
          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base max-[380px]:text-xs">
              Имя пользователя
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base max-[380px]:text-xs max-[380px]:px-2 max-[380px]:py-1.5"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base max-[380px]:text-xs">
              Полное имя
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base max-[380px]:text-xs max-[380px]:px-2 max-[380px]:py-1.5"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base max-[380px]:text-xs">
              Текущий пароль
            </label>
            <input
              type="password"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base max-[380px]:text-xs max-[380px]:px-2 max-[380px]:py-1.5"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base max-[380px]:text-xs">
              Новый пароль
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base max-[380px]:text-xs max-[380px]:px-2 max-[380px]:py-1.5"
            />
          </div>

          <div className="flex justify-end gap-3 sm:gap-4 pt-4 max-[380px]:pt-2 max-[380px]:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base max-[380px]:text-xs max-[380px]:px-2 max-[380px]:py-1"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base max-[380px]:text-xs max-[380px]:px-2 max-[380px]:py-1"
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}