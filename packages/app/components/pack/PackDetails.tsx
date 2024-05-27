import React, { useState } from 'react';

import PackContainer from './PackContainer';
import { DetailsHeader } from '../details/header';
import { TableContainer } from '../pack_table/Table';
import { RButton, RText } from '@packrat/ui';
import { DetailsComponent } from '../details';
import {
  Dimensions,
  Platform,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../theme';
import { CLIENT_URL } from '@packrat/config';
import ScoreContainer from '../ScoreContainer';
import ChatContainer from '../chat';
import { AddItem } from '../item/AddItem';
import { AddItemModal } from './AddItemModal';
import useCustomStyles from 'app/hooks/useCustomStyles';
import { useUserPacks } from 'app/hooks/packs/useUserPacks';
import { usePackId } from 'app/hooks/packs/usePackId';
import { useFetchSinglePack } from '../../hooks/packs';
import { useAuthUser } from 'app/auth/hooks';
import { useIsAuthUserPack } from 'app/hooks/packs/useIsAuthUserPack';
import Layout from 'app/components/layout/Layout';
import { ScrollView } from 'native-base';

const SECTION = {
  TABLE: 'TABLE',
  CTA: 'CTA',
  SCORECARD: 'SCORECARD',
  CHAT: 'CHAT',
};

export function PackDetails() {
  // const [canCopy, setCanCopy] = useParam('canCopy')
  const canCopy = false;
  const [packId] = usePackId();
  const link = `${CLIENT_URL}/packs/${packId}`;
  const [firstLoad, setFirstLoad] = useState(true);
  const user = useAuthUser();
  const userId = user?.id;
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const { data: userPacks, isLoading: isUserPacksLoading } =
    useUserPacks(userId);
  const {
    data: currentPack,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useFetchSinglePack(packId);
  const isAuthUserPack = useIsAuthUserPack(currentPack);

  const styles = useCustomStyles(loadStyles);
  const currentPackId = currentPack && currentPack.id;

  // check if user is owner of pack, and that pack and user exists
  const isOwner = currentPack && user && currentPack.owner_id === user.id;

  const isError = error !== null;

  if (isLoading) return <RText>Loading...</RText>;

  return (
    <Layout>
      <View
        style={[
          styles.mainContainer,
          // Platform.OS == 'web'
          //   ? { minHeight: '100vh' }
          //   : { minHeight: Dimensions.get('screen').height },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {!isError && (
            <DetailsComponent
              type="pack"
              data={currentPack}
              isLoading={isLoading}
              error={error}
              additionalComps={
                <>
                  <View>
                    <FlatList
                      data={Object.entries(SECTION)}
                      contentContainerStyle={{ paddingBottom: 50 }}
                      keyExtractor={([key, val]) => val}
                      renderItem={({ item }) => {
                        {
                          switch (item[1]) {
                            case SECTION.TABLE:
                              return (
                                <TableContainer
                                  currentPack={currentPack}
                                  copy={canCopy}
                                  hasPermissions={isAuthUserPack}
                                />
                              );
                            case SECTION.CTA:
                              return isAuthUserPack ? (
                                <AddItemModal
                                  currentPackId={currentPackId}
                                  currentPack={currentPack}
                                  isAddItemModalOpen={isAddItemModalOpen}
                                  setIsAddItemModalOpen={setIsAddItemModalOpen}
                                  // refetch={refetch}
                                  setRefetch={() => setRefetch((prev) => !prev)}
                                />
                              ) : null;
                            case SECTION.SCORECARD:
                              return (
                                <ScoreContainer
                                  type="pack"
                                  data={currentPack}
                                  isOwner={isOwner}
                                />
                              );
                            case SECTION.CHAT:
                              return (
                                <View style={styles.boxStyle}>
                                  <ChatContainer
                                    itemTypeId={currentPackId}
                                    title="Chat"
                                    trigger="Open Chat"
                                  />
                                </View>
                              );
                            default:
                              return null;
                          }
                        }
                      }}
                    />
                  </View>
                </>
              }
              link={link}
            />
          )}
        </ScrollView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 50,
            bottom: 30,
            backgroundColor: '#0A84FF',
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            // zIndex: 9999,
          }}
          onPress={() => {
            console.log('hello');
          }}
        >
          <RText style={{ color: 'white', fontSize: 24 }}>+</RText>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const loadStyles = (theme) => {
  const { currentTheme } = theme;
  return {
    mainContainer: {
      position: 'relative',
      backgroundColor: currentTheme.colors.background,
      flexDirection: 'column',
      gap: 15,
      fontSize: 18,
      width: '100%',
      flex: 1,
      maxHeight: '91vh',
    },
    packsContainer: {
      flexDirection: 'column',
      minHeight: '100vh',
      padding: 25,
      fontSize: 26,
    },
    dropdown: {
      backgroundColor: currentTheme.colors.white,
    },
    boxStyle: {
      padding: 5,
      borderRadius: 10,
      width: '100%',
      minHeight: 400,
    },
  };
};
