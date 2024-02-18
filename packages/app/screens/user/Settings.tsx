import { Ionicons } from '@expo/vector-icons';
import {
  RInput,
  RSeparator,
  RText,
  RStack,
  RButton,
  RH5,
  RH2,
  RScrollView,
  RLabel,
  CustomForm,
  ImageUpload,
  CustomInput,
  CustomSelect,
} from '@packrat/ui';
import Avatar from 'app/components/Avatar/Avatar';
import DropdownComponent from '../../components/Dropdown';
import { useProfileSettings } from 'app/hooks/user';

const weatherOptions = ['celsius', 'fahrenheit'].map((key) => ({
  label: key,
  value: key,
}));

const weightOptions = ['lb', 'oz', 'kg', 'g'].map((key) => ({
  label: key,
  value: key,
}));

export default function Settings() {
  const { user, handleEditUser, handlePasswordsChange, handleUpdatePassword } =
    useProfileSettings();

  return user ? (
    <RScrollView>
      <RStack
        space="$3"
        width="fit-content"
        paddingVertical={20}
        marginHorizontal="auto"
      >
        <RStack>
          <RH2>Profile</RH2>
          <RSeparator marginVertical={8} />
        </RStack>
        <CustomForm onSubmit={handleEditUser} defaultValues={{ ...user }}>
          <RStack space="$3" width="fit-content" marginHorizontal="auto">
            <ImageUpload
              label="Profile Picture"
              name="profileImage"
              previewElement={<Avatar size={90} />}
            />
            <RStack space="$3" style={{ flexDirection: 'row' }}>
              <RStack space="$2">
                <RLabel htmlFor="firstName">Name</RLabel>
                <CustomInput id="name" name="name" />
              </RStack>
              <RStack space="$2">
                <RLabel htmlFor="username">Username</RLabel>
                <CustomInput id="username" name="username" />
              </RStack>
            </RStack>
            <RStack space="$2">
              <RLabel htmlFor="email">Email</RLabel>
              <CustomInput id="email" name="email" />
            </RStack>
            <RStack space="$2">
              <RH5>Preferred units</RH5>
              <RStack space style={{ flexDirection: 'row' }}>
                <RStack space="$2" flexGrow={1}>
                  <RLabel>Weather: </RLabel>
                  <CustomSelect
                    options={weatherOptions}
                    name="preferredWeather"
                    style={{ width: '100%' }}
                  />
                </RStack>
                <RStack space="$2" flexGrow={1}>
                  <RLabel>Weight: </RLabel>
                  <CustomSelect
                    options={weightOptions}
                    name="preferredWeight"
                    style={{ width: '100%' }}
                  />
                </RStack>
              </RStack>
            </RStack>
            <RButton color="white" style={{ backgroundColor: '#0284c7' }}>
              Update profile
            </RButton>
          </RStack>
        </CustomForm>

        <RStack marginTop={20} marginBottom={10}>
          <RH2>Change Password</RH2>
          <RSeparator marginVertical={8} />
          <RText fontSize={16}>We will email you to verify the change.</RText>
        </RStack>
        <CustomForm>
          <RStack space="$3" width="100%" marginHorizontal="auto">
            <RStack space="$2">
              <RLabel htmlFor="oldPassword">Old password</RLabel>
              <CustomInput
                id="oldPassword"
                name="oldPassword"
                secureTextEntry={true}
              />
            </RStack>
            <RStack space="$2">
              <RLabel htmlFor="newPassword">New password</RLabel>
              <CustomInput
                id="newPassword"
                name="newPassword"
                secureTextEntry={true}
              />
            </RStack>
            <RStack space="$2">
              <RLabel htmlFor="confirmPassword">Confirm new password</RLabel>
              <CustomInput
                id="confirmPassword"
                name="confirmPassword"
                secureTextEntry={true}
              />
            </RStack>
            <RButton color="white" style={{ backgroundColor: '#0284c7' }}>
              Change password
            </RButton>
          </RStack>
        </CustomForm>
      </RStack>
    </RScrollView>
  ) : null;
}
