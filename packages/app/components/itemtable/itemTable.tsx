import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { Table, Row, Cell } from 'react-native-table-component';
import { theme } from '../../theme';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import { RButton, RStack, RText } from '@packrat/ui';
import { formatNumber } from '../../utils/formatNumber';
import { EditPackItemModal } from '../pack_table/EditPackItemModal';
import { DeletePackItemModal } from '../pack_table/DeletePackItemModal';
import { PaginationLimit } from '../paginationChooseLimit';
import Loader from '../Loader';
import useCustomStyles from 'app/hooks/useCustomStyles';
import { loadStyles } from './itemsTable.style';
import { AddItem } from '../item/AddItem';
import { useScreenWidth } from 'app/hooks/common';
import { useDeleteItem } from 'app/hooks/items';
import { useAuthUser } from 'app/auth/hooks';

interface ItemsTableProps {
  limit: number;
  setLimit: (limit: number) => void;
  page: number;
  setPage: (page: number) => void;
  data: YourItemType[];
  isLoading: boolean;
  totalPages: number;
}

interface YourItemType {
  global: string;
  name: string;
  weight: number;
  category?: { name: string };
  quantity: number;
  unit: string;
  id: string;
  type: string;
}

interface TitleRowProps {
  title: string;
}

interface TableItemProps {
  itemData: YourItemType;
}

export const ItemsTable = ({
  limit,
  setLimit,
  page,
  setPage,
  data,
  isLoading,
  totalPages,
}: ItemsTableProps) => {
  const flexArr = [1.5, 1, 1, 1, 0.65, 0.65, 0.65];
  const { screenWidth } = useScreenWidth();
  const { handleDeleteItem } = useDeleteItem();

  const { enableDarkMode, enableLightMode, isDark, isLight, currentTheme } =
    useTheme();
  const styles = useCustomStyles(loadStyles);
  const TitleRow = ({ title }: TitleRowProps) => {
    const rowData = [
      <RStack style={{ flexDirection: 'row', ...styles.mainTitle }}>
        <Text style={styles.titleText}>{title}</Text>
      </RStack>,
    ];

    return (
      <Row data={rowData} style={styles.title} textStyle={styles.titleText} />
    );
  };
  const TableItem = ({ itemData }: TableItemProps) => {
    const { name, weight, category, quantity, unit, id, type, ownerId } =
      itemData;
    const authUser = useAuthUser();

    const rowData = [
      <RText style={{ color: isDark ? 'white' : 'black' }}>{name}</RText>,
      <RText style={{ color: isDark ? 'white' : 'black' }}>
        {formatNumber(weight)} {unit}
      </RText>,
      <RText style={{ color: isDark ? 'white' : 'black' }}>{quantity}</RText>,
      <RText style={{ color: isDark ? 'white' : 'black' }}>
        {category?.name || type}
      </RText>,
      authUser.id === ownerId ? (
        <EditPackItemModal
          key="edit-pack-item"
          triggerComponent={
            <MaterialIcons
              name="edit"
              size={20}
              color={currentTheme.colors.primary}
            />
          }
        >
          <AddItem
            packId={id}
            isEdit={true}
            isItemPage
            initialData={itemData}
            editAsDuplicate={false}
            setPage={setPage}
            page={page}
          />
        </EditPackItemModal>
      ) : (
        ''
      ),
      authUser.id === ownerId ? (
        <DeletePackItemModal
          key="delete-pack-item"
          onConfirm={(closeModal) => {
            handleDeleteItem(id, closeModal);
          }}
          triggerComponent={
            <MaterialIcons
              name="delete"
              size={20}
              color={currentTheme.colors.error}
            />
          }
        />
      ) : (
        ''
      ),
    ];
    return (
      <Row
        data={rowData}
        style={{
          backgroundColor: isDark ? '#1A1A1D' : 'white',
          borderBottomWidth: !isDark ? 1 : 'none',
          borderBottomColor: !isDark ? '#D1D5DB' : 'none',
          ...styles.row,
        }}
        flexArr={flexArr}
      />
    );
  };
  /**
   * Handles the logic for navigating to the next page.
   *
   * @return {undefined} This function doesn't return anything.
   */
  const handleNextPage = () => {
    setPage(page + 1);
  };
  /**
   * Handles the action of going to the previous page.
   *
   * @return {undefined} There is no return value.
   */
  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  return (
    <ScrollView>
      <View
        style={{
          paddingVertical: 16,
          flex: 1,
          paddingTop: 30,
          marginTop: 20,
          backgroundColor: isDark ? '#1A1A1D' : 'white',
        }}
      >
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            maxWidth: '100%',
          }}
        >
          <Table
            style={styles.tableStyle}
            borderStyle={{ borderColor: 'transparent' }}
          >
            <TitleRow title="Global Items List" />
            <Row
              flexArr={flexArr}
              data={[
                'Item Name',
                'Weight',
                'Quantity',
                'Category',
                'Edit',
                'Delete',
              ].map((header, index) => (
                <Cell
                  key={index}
                  data={
                    <RText style={{ fontSize: screenWidth <= 425 ? 11 : 15 }}>
                      {header}
                    </RText>
                  }
                  textStyle={styles.headerText}
                />
              ))}
              style={styles.head}
            />
            <ScrollView style={{ height: 400 }}>
              {isLoading ? (
                <Loader />
              ) : (
                data.map((item, index) => {
                  return <TableItem key={index} itemData={item} />;
                })
              )}
            </ScrollView>
          </Table>
        </ScrollView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <RButton
            style={{
              width: 50,
              backgroundColor: page < 2 ? 'gray' : '#0284c7',
              borderRadius: 5,
              borderColor: page < 2 ? 'gray' : '#0284c7',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            disabled={page < 2}
            onPress={handlePreviousPage}
          >
            <AntDesign name="left" size={16} color="white" />
          </RButton>
          <RButton
            style={{
              marginLeft: 10,
              width: 50,
              backgroundColor: page === totalPages ? 'gray' : '#0284c7',
              borderRadius: 5,
              borderColor: page === totalPages ? 'gray' : '#0284c7',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            disabled={page === totalPages}
            onPress={handleNextPage}
          >
            <AntDesign name="right" size={16} color="white" />
          </RButton>
        </View>
      </View>
      <PaginationLimit limit={limit} setLimit={setLimit} />
    </ScrollView>
  );
};
