import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions } from 'react-native';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import client from '../apollo';
import { useNavigation } from '@react-navigation/native';



const GET_ALL_POKEMON = gql`
	query GetAllPokemon {
		pokemon_v2_pokemon(limit: 100) {
			name
			id
			pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
		}
	}
`;
const { height } = Dimensions.get("window");

const HomeScreen = () => {
	const { loading, error, data } = useQuery(GET_ALL_POKEMON);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredPokemonList, setFilteredPokemonList] = useState([]);

	const navigation = useNavigation();
	if (loading) {
		return <Text>Loading...</Text>;
	}

	if (error) {
		return <Text>Error: {error.message}</Text>;
	}

	const pokemonList = data?.pokemon_v2_pokemon || [];

	const handlePokemonPress = (name) => {
		navigation.navigate('Pokemon', { name });
	};



	const handleSearchQueryChange = (query) => {
		setSearchQuery(query);

		const filteredList = pokemonList.filter((pokemon) =>
			pokemon.name.toLowerCase().includes(query.toLowerCase())
		);
		setFilteredPokemonList(filteredList);
	};

	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<TextInput
					style={[styles.searchInput, { fontStyle: 'italic' }]}
					placeholder="Search Pokemon..."
					placeholderTextColor="#1987ff"
					value={searchQuery}
					onChangeText={handleSearchQueryChange}
				/>
				<TouchableOpacity style={styles.searchButton} onPress={() => handleSearchQueryChange('')}>
					<Text style={styles.searchButtonText}>Clear</Text>
				</TouchableOpacity>
			</View>
			<FlatList
				data={searchQuery ? filteredPokemonList : pokemonList}
				keyExtractor={(item) => item.name}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handlePokemonPress(item.name)}>
						<View style={{
							borderBottomWidth: 0,
							paddingVertical: 16,
							paddingHorizontal: 12,
							height: 150,
							alignItems: 'center',
						}}>
							<View
								style={{
									position: 'absolute',
									width: 334,
									height: 140,
									backgroundColor: "rgba(0,0,0,0)",
									elevation: 10,
								}}
							>

								<ImageBackground
									source={{ uri: `https://raw.githubusercontent.com/Varun-Singh14/Pokemon/master/assets/TypeBG/${item.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name.charAt(0).toUpperCase() + item.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name.slice(1)}.png` }}
									style={{
										position: 'absolute',
										width: 334,
										height: 115,
										borderRadius: 10,
										opacity: 1,
										left: 0,
										right: 'auto',
										top: 25,
										bottom: 'auto',
										overflow: 'hidden',
									}}
								>
									<ImageBackground
										source={{ uri: `https://raw.githubusercontent.com/Varun-Singh14/Pokemon/master/Vector.png` }}
										style={{
											position: 'absolute',
											width: 334,
											height: 115,
											borderRadius: 10,
											opacity: 1,
											left: 0,
											right: 'auto',
											top: 0,
											bottom: 'auto',
											overflow: 'hidden',
										}}
									>
										<View
											style={{
												position: 'absolute',
												width: 'auto',
												height: 'auto',
												left: 20,
												right: 'auto',
												top: 45,
												bottom: 'auto',
											}}
										>
											<Text
												style={{
													fontSize: 12,
													color: "rgba(23,23,27,0.6)",
													fontWeight: 700,
													textAlign: 'left',
													textAlignVertical: 'top',
													letterSpacing: 0.1,
												}}
											>#0{item.id}</Text>
										</View>

										<View
											style={{
												position: 'absolute',
												width: 'auto',
												height: 'auto',
												left: 20,
												right: 'auto',
												top: 59,
												bottom: 'auto',
											}}
										>
											<Text
												style={{
													fontSize: 26,
													color: "rgba(255,255,255,1)",
													fontWeight: 700,
													textAlign: 'left',
													textAlignVertical: 'top',
													letterSpacing: 0.1,
												}}
											>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
										</View>

									</ImageBackground>
								</ImageBackground>
								<Image
									source={{ uri: `https://raw.githubusercontent.com/Varun-Singh14/Pokemon/master/assets/images/${item.id}.png`, }}
									style={{
										position: 'absolute',
										width: 130,
										height: 130,
										borderRadius: 0,
										opacity: 1,
										left: 194,
										right: 'auto',
										top: 0,
										bottom: 'auto',
										backgroundColor: "rgba(0,0,0,0)",
									}}
								/>
							</View>
						</View>
					</TouchableOpacity>
				)
				}
			/>
		</View >
	);
};


const styles = StyleSheet.create({
	container: {
		height: height,
		backgroundColor: '#FFFFFF',
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 8,
		backgroundColor: '#F5F5F5',
	},
	searchInput: {
		flex: 1,
		height: 40,
		backgroundColor: '#FFFFFF',
		borderRadius: 4,
		paddingHorizontal: 12,
		marginRight: 8,
		color: '#1987ff',
	},
	searchButton: {
		backgroundColor: '#1987ff',
		borderRadius: 4,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	searchButtonText: {
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
});



export default () => (
	<ApolloProvider client={client}>
		<HomeScreen />
	</ApolloProvider>
);
