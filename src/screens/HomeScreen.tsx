// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { getMe } from '../services/auth';
import { getCasos, Caso } from '../services/casos';
import { getUserById } from '../services/users';
import { MainTabParamList } from '../navigation/MainAppTabs';

// Screen width for charts
const screenWidth = Dimensions.get('window').width;

type Navigation = NavigationProp<MainTabParamList>;

interface UserState {
  _id: string;
  username: string;
  role: string;
}

interface UserMap {
  [id: string]: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const theme = useTheme();
  const colors = theme.colors;

  const [user, setUser] = useState<UserState | null>(null);
  const [cases, setCases] = useState<Caso[]>([]);
  const [userMap, setUserMap] = useState<UserMap>({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
    );

    async function loadData() {
      try {
        const me = await getMe();
        setUser({ _id: me._id, username: me.username, role: me.role });

        const fetchedCases = await getCasos();
        setCases(fetchedCases);

        const uniqueIds = Array.from(
          new Set(fetchedCases.map(c => c.responsavel).filter(Boolean))
        );
        const tempMap: UserMap = {};
        await Promise.all(
          uniqueIds.map(async id => {
            try {
              const u = await getUserById(id);
              tempMap[id] = u.username;
            } catch {
              tempMap[id] = 'Não informado';
            }
          })
        );
        setUserMap(tempMap);
      } catch (error) {
        console.error(error);
        Alert.alert(
          'Erro',
          'Falha ao carregar dados. Você será redirecionado ao login.',
          [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] }) }]
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Count by status
  const statusCount = cases.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});
  const openCount = statusCount['Em andamento'] || 0;
  const doneCount = statusCount['Finalizado'] || 0;
  const archivedCount = statusCount['Arquivado'] || 0;

  const pieData = [
    { name: 'Em andamento', population: openCount, color: '#36A2EB', legendFontColor: colors.text, legendFontSize: 14 },
    { name: 'Finalizado', population: doneCount, color: '#4BC0C0', legendFontColor: colors.text, legendFontSize: 14 },
    { name: 'Arquivado', population: archivedCount, color: '#C9CBCF', legendFontColor: colors.text, legendFontSize: 14 },
  ];

  // Count by type
  const typeCount = cases.reduce<Record<string, number>>((acc, c) => {
    acc[c.contexto.tipoCaso] = (acc[c.contexto.tipoCaso] || 0) + 1;
    return acc;
  }, {});
  const tiposCasos = Object.keys(typeCount);
  const tiposValores = Object.values(typeCount);

  // Count by responsible
  const expertCount = cases.reduce<Record<string, number>>((acc, c) => {
    const name = userMap[c.responsavel] || 'Não informado';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const expertLabels = Object.keys(expertCount);
  const expertValues = Object.values(expertCount);

  // Recent 5 cases
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const renderRecent = ({ item }: { item: Caso }) => {
    const name = userMap[item.responsavel] || 'Não informado';
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('GerenciarCasos')}
      >
        <Text style={[styles.cell, { flex: 2, color: colors.primary }]} numberOfLines={1}>
          {item.titulo}
        </Text>
        <Text style={[styles.cell, { flex: 1, color: colors.text }]}>{item.contexto.tipoCaso}</Text>
        <Text style={[styles.cell, { flex: 1, color: colors.text }]}>{item.status}</Text>
        <Text style={[styles.cell, { flex: 1, color: colors.text }]}> 
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={[styles.cell, { flex: 1, color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.cell, { flex: 0.5, color: colors.primary }]}>Ver</Text>
      </TouchableOpacity>
    );
  };

  const chartConfigPie = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    propsForBackgroundLines: { stroke: 'rgba(255,255,255,0.1)' },
  };

  const chartConfigBar = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    propsForBackgroundLines: { stroke: 'rgba(255,255,255,0.1)' },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Top Banner */}
      <View style={[styles.topBanner, { backgroundColor: colors.surface, borderBottomColor: colors.primary }]}> 
        <View style={styles.bannerContent}>
          <Image source={require('../../assets/logo_dentefier.png')} style={styles.mainLogo} resizeMode="contain" />
          <View style={styles.bannerTextContainer}>
            <Text style={[styles.bannerTitle, { color: colors.primary }]}>DENTEFIER</Text>
            <Text style={[styles.originBadge, { backgroundColor: colors.primary, color: colors.background }]}>Laudos e Perícias</Text>
            <Text style={[styles.bannerSubtitle, { color: colors.text }]}>SGCO</Text>
          </View>
        </View>
      </View>

      {/* NavBar */}
      <View style={[styles.navBar, { backgroundColor: colors.surface }]}> 
        <TouchableOpacity><Text style={[styles.navItem, { color: colors.primary, borderBottomColor: colors.primary }]}>HOME</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GerenciarCasos')}><Text style={[styles.navItem, { color: colors.primary }]}>GERENCIAR CASOS</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] })}><Text style={[styles.navItem, { color: colors.primary }]}>SAIR</Text></TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.mainContainer}>
        <View style={[styles.welcomeSection, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}> 
          <Text style={[styles.welcomeText, { color: colors.text }]}>Bem-vindo(a), <Text style={[styles.userName, { color: colors.primary }]}>{user?.username}</Text> <Text style={[styles.userRole, { color: colors.primary }]}>{`(${user?.role})`}</Text>!</Text>
          <View style={[styles.dateInfo, { backgroundColor: 'rgba(0,0,0,0.1)' }]}> 
            <Text style={[styles.dateText, { color: colors.text }]}>Data: {currentDate}</Text>
          </View>
        </View>

        {/* 4) Resumo de Casos (3 cards) */}
        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Resumo de Casos</Text>
          <View style={styles.cardsContainer}>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.primary }]}>Casos Abertos</Text>
              <Text style={[styles.cardNumber, { color: colors.primary }]}>{openCount}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.text }]}>Em análise ou resolução</Text>
              <TouchableOpacity
                style={[styles.cardButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('GerenciarCasos', { statusF: 'Em andamento' })}
              >
                <Text style={[styles.cardButtonText, { color: colors.background }]}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.primary }]}>Casos Finalizados</Text>
              <Text style={[styles.cardNumber, { color: colors.primary }]}>{doneCount}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.text }]}>Processos concluídos</Text>
              <TouchableOpacity
                style={[styles.cardButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('GerenciarCasos', { statusF: 'Finalizado' })}
              >
                <Text style={[styles.cardButtonText, { color: colors.background }]}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.primary }]}>Casos Arquivados</Text>
              <Text style={[styles.cardNumber, { color: colors.primary }]}>{archivedCount}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.text }]}>Armazenados para referência</Text>
              <TouchableOpacity
                style={[styles.cardButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('GerenciarCasos', { statusF: 'Arquivado' })}
              >
                <Text style={[styles.cardButtonText, { color: colors.background }]}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 5) Gráficos */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Estatísticas de Casos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {/* PieChart de status */}
            <View style={[styles.chartCard, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <Text style={[styles.chartTitle, { color: colors.primary }]}>Distribuição por Status</Text>
              <PieChart
                data={pieData}
                width={screenWidth * 0.8}
                height={200}
                chartConfig={chartConfigPie}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
            {/* BarChart de tipos de caso */}
            <View style={[styles.chartCard, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <Text style={[styles.chartTitle, { color: colors.primary }]}>Casos por Tipo</Text>
              <BarChart
                data={{ labels: tiposCasos, datasets: [{ data: tiposValores }] }}
                width={screenWidth * 0.8}
                height={200}
                fromZero
                chartConfig={chartConfigBar}
                verticalLabelRotation={45}
                yAxisLabel=""
                yAxisSuffix=""
              />
            </View>
          </ScrollView>
        </View>

        {/* 6) Casos por Responsável */}
        <View style={styles.expertSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Casos por Responsável</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            <View style={[styles.expertStatsContainer, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <BarChart
                data={{ labels: expertLabels, datasets: [{ data: expertValues }] }}
                width={screenWidth * 1.5}
                height={250}
                fromZero
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfigBar}
                horizontalLabelRotation={0}
                withHorizontalLabels
                verticalLabelRotation={0}
                showValuesOnTopOfBars={false}
                showBarTops={false}
                style={{ marginLeft: -30 }}
              />
            </View>
          </ScrollView>
        </View>

        {/* 7) Casos Recentes (FlatList) */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Casos Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('GerenciarCasos')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={[styles.row, styles.headerRow, { backgroundColor: colors.primary }]}>
                <Text style={[styles.headerCell, { flex: 2 }]}>Título</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Tipo</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Data</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Responsável</Text>
                <Text style={[styles.headerCell, { flex: 0.5 }]}>Ações</Text>
              </View>
              <FlatList
                data={recentCases}
                keyExtractor={(item) => item._id}
                renderItem={renderRecent}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBanner: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainLogo: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  bannerTextContainer: {
    flexDirection: 'column',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  originBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  accessibilityTools: {
    flexDirection: 'row',
    gap: 10,
  },
  accessBtn: {
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navItem: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  mainContainer: {
    padding: 20,
  },
  welcomeSection: {
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 5,
  },
  userName: {
    fontWeight: 'bold',
  },
  userRole: {
    fontWeight: 'bold',
  },
  dateInfo: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 12,
  },
  summarySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '30%',
    minWidth: 100,
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  cardButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  cardButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chartsSection: {
    marginBottom: 20,
  },
  chartCard: {
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    marginRight: 15,
    alignItems: 'center',
    width: screenWidth * 0.8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expertSection: {
    marginBottom: 20,
  },
  expertStatsContainer: {
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerRow: {
    // só cor de fundo pelo JS no componente
  },
  headerCell: {
    fontWeight: 'bold',
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#FFFFFF',
  },
  cell: {
    paddingHorizontal: 5,
    fontSize: 12,
  },
  footer: {
    borderTopWidth: 3,
    paddingVertical: 15,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerOriginContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerOrigin: {
    fontStyle: 'italic',
    fontSize: 12,
  },
});

export default HomeScreen;
