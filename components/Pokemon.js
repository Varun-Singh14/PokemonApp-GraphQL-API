import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, StatusBar } from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import SPACING from '../config/SPACING';
import colors from '../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PokemonTypesData from '../config/PokemonTypes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from './BottomSheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import Records from '../assets/Pokemon/pokedex.json';
import { useRoute } from '@react-navigation/native';



const GET_POKEMON_DETAILS = gql`
    query GetPokemonDetails($name: String!) {
        pokemon_v2_pokemon(where: { name: { _eq: $name } }) {
            id
            name
            height
            weight
            base_experience
            pokemon_v2_pokemonsprites {
                sprites
            }
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
            pokemon_v2_pokemonabilities {
                pokemon_v2_ability {
                    name
                }
            }
            pokemon_v2_pokemonstats {
                base_stat
                pokemon_v2_stat {
                    name
                }
            }
            pokemon_v2_pokemonforms {
                pokemon_v2_pokemonformnames(where: { language_id: { _eq: 9 } }) {
                    name
                }
            }
            pokemon_v2_pokemonmoves {
                level
                move_id
                move_learn_method_id
            }
            
        }
        pokemon_v2_pokemonspecies (where: { name: { _eq: $name } }) {
            pokemon_v2_pokemonspecies {
                capture_rate
                base_happiness
                gender_rate
                name
                order
                pokemon_v2_generation {
                    name
                }
            }
        }
        
    }
`;

const { height, width } = Dimensions.get("window");

const Tab = createMaterialTopTabNavigator();

const MAX_BASE_STAT = 255;

const Pokemon = () => {
    const route = useRoute();
    const name = route.params.name;

    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const [pokemonDetails, setPokemonDetails] = useState(null);
    const { loading, error, data } = useQuery(GET_POKEMON_DETAILS, {
        variables: { name },
    });

    useEffect(() => {
        if (data) {
            setPokemonDetails(data.pokemon_v2_pokemon[0]);
            console.log('DATA: ', data)
        }
    }, [data]);

    const CustomTabBarLabel = ({ focused, label }) => {
        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

        const activeColor =
            PokemonTypesData.find(
                (typeData) =>
                    typeData.type ===
                    pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name
            )?.color || 'transparent';

        const labelColor = focused ? activeColor : 'rgba(0, 0, 0, 0.4)';

        return <Text style={{ color: labelColor, textTransform: 'none', fontSize: 14, fontWeight: 'bold' }}>{formattedLabel}</Text>;
    };

    if (loading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: 20,
            }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: 20,
            }}>
                <Text style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: colors.dark,
                    textAlign: 'center',
                }}>Error fetching Pokemon details.</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView
            style={{
                flex: 1,
            }}
        >

            <ScrollView>
                <SafeAreaView
                    style={{
                        flex: 1,
                    }}
                >
                    {pokemonDetails ? (
                        <ImageBackground
                            source={{ uri: `https://raw.githubusercontent.com/Varun-Singh14/Pokemon/master/assets/TypeBG/${pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name.charAt(0).toUpperCase() + pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name.slice(1)}.png` }}

                            style={{
                                flex: 1,
                                resizeMode: 'cover',
                                height: height,
                                width: width,
                            }}
                        >
                            <View>
                                <TouchableOpacity
                                    style={{
                                        padding: SPACING / 2,
                                        height: SPACING * 5,
                                        width: SPACING * 5,
                                        marginTop: SPACING * 2,
                                        marginLeft: SPACING * 1,
                                        borderRadius: SPACING * 1.5,
                                        alignItems: 'center',
                                    }}
                                    onPress={handleBackPress}
                                >
                                    <Ionicons
                                        name="arrow-back"
                                        color={colors.white}
                                        size={SPACING * 2.5}
                                    />
                                </TouchableOpacity>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        paddingHorizontal: SPACING * 2,
                                    }}
                                >
                                    <ImageBackground
                                        source={{ uri: `https://raw.githubusercontent.com/Varun-Singh14/Pokemon/master/assets/images/${pokemonDetails?.id}.png`, }}
                                        style={{
                                            left: SPACING,
                                            width: 110,
                                            height: 110,
                                            overflow: 'hidden',
                                            resizeMode: "cover",
                                        }}
                                    />

                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            paddingRight: SPACING * 2,
                                            paddingLeft: SPACING * 4,
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: colors['dark-light'],
                                                fontWeight: 600,
                                                fontSize: SPACING * 2,
                                            }}
                                        >#00{pokemonDetails?.id}</Text>

                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: colors.white,
                                                fontWeight: 800,
                                                fontSize: SPACING * 3,
                                            }}
                                        >{pokemonDetails?.name.charAt(0).toUpperCase() + pokemonDetails?.name.slice(1)}</Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || 'transparent',
                                                    paddingHorizontal: SPACING,
                                                    paddingVertical: SPACING / 2,
                                                    borderRadius: SPACING / 2,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'row',
                                                    marginTop: SPACING / 2,
                                                }}
                                            >
                                                <ImageBackground
                                                    source={{ uri: `https://raw.githubusercontent.com/Varun-Singh14/Pokemon/master/assets/Others/type-icons/png-original/${pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name}.png` }}
                                                    style={{
                                                        width: SPACING * 2,
                                                        height: SPACING * 2,
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        color: colors.white,
                                                        fontWeight: 500,
                                                        fontSize: SPACING * 1.5,
                                                        marginLeft: SPACING / 2,
                                                    }}
                                                >{pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name.charAt(0).toUpperCase() + pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name.slice(1)}</Text>
                                            </View>
                                        </View>

                                    </View>
                                </View>

                            </View>


                            <StatusBar style="light" />
                            <BottomSheet>
                                <View
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <Tab.Navigator
                                        screenOptions={({ route }) => ({
                                            tabBarActiveTintColor: PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || 'transparent',
                                            tabBarInactiveTintColor: 'gray',
                                            tabBarLabel: ({ focused }) => (
                                                <CustomTabBarLabel focused={focused} label={route.name} />
                                            ),
                                            tabBarStyle: {
                                                backgroundColor: colors.white,
                                                marginLeft: -8,
                                                paddingHorizontal: 10,
                                                elevation: 0,
                                                shadowOpacity: 0,
                                            },
                                            tabBarIndicatorStyle: {
                                                marginLeft: 10,
                                                backgroundColor: PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || 'transparent',
                                            },
                                            tabBarItemStyle: {
                                                flex: 1,
                                            },
                                        })}
                                    >
                                        <Tab.Screen name='About' component={About} initialParams={{ name: pokemonDetails.name, pokemonId: pokemonDetails.id }} />
                                        <Tab.Screen name='Stats' component={BaseStats} initialParams={{ pokemonName: pokemonDetails.name, pokeId: pokemonDetails.id }} />
                                    </Tab.Navigator>

                                </View>
                            </BottomSheet>
                        </ImageBackground>
                    ) : (
                        <Text style={{
                            fontSize: 18,
                            marginBottom: 10,
                            color: '#FFFFFF',
                            textAlign: 'center',
                        }}></Text>
                    )}
                </SafeAreaView>
            </ScrollView>
        </GestureHandlerRootView >
    )
};

const convertToFeetAndInches = (meters) => {
    const totalInches = meters * 39.37;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    return `${feet}ft. ${inches}in`;
};


const About = () => {
    const route = useRoute();
    const name = route.params.name;
    const { pokemonId } = route.params;

    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [details, setDetails] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [pokedexData, setPokedexData] = useState(null);

    const { loading, error, data: detailsData } = useQuery(GET_POKEMON_DETAILS, {
        variables: { name },
    });

    useEffect(() => {
        setPokedexData(Records);
    }, []);

    useEffect(() => {
        if (!pokedexData) {
            return;
        }

        const selectedPokemon = pokedexData.find((record) => record.id === pokemonId);

        if (!selectedPokemon) {
            return;
        }

        const evolutionDetails = selectedPokemon.evolution;



        if (evolutionDetails && evolutionDetails.next) {
            [evolutionId, evolutionLevel] = evolutionDetails.next[0];
        }

        setDetails(selectedPokemon);
    }, [pokedexData, pokemonId]);

    useEffect(() => {
        if (!loading && !error && detailsData && detailsData.pokemon_v2_pokemon.length > 0) {
            setPokemonDetails(detailsData.pokemon_v2_pokemon[0]);
        }
    }, [detailsData]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(delay);
    }, []);

    if (isLoading || loading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: 20,
            }}>
                <ActivityIndicator size="large" color={PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || colors.dark} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: 20,
            }}>
                <Text style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: colors.dark,
                    textAlign: 'center',
                }}>Error fetching Pokemon details.</Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white,
            }}
        >
            <View
                style={{
                    marginTop: SPACING * 2,
                    marginBottom: 7.5,
                    paddingHorizontal: SPACING * 2,
                }}
            >
                <Text
                    style={{
                        color: colors.dark,
                        fontSize: SPACING * 1.3,
                    }}
                >
                    {details.description}
                </Text>
            </View>
            <View
                style={{
                    marginTop: SPACING * 2,
                    marginBottom: 7.5,
                    paddingHorizontal: SPACING * 2,
                }}
            >
                <Text
                    style={{
                        fontSize: SPACING * 1.5,
                        color: PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || 'transparent',
                        fontWeight: 'bold',
                    }}
                >
                    Pokedex Data
                </Text>
            </View>

            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Species</Text>
                    <Text
                        style={{
                            color: colors.dark,
                        }}
                    >
                        {details.species}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Height</Text>
                    <Text
                        style={{
                            color: colors.dark,
                        }}
                    >
                        {convertToFeetAndInches(pokemonDetails.height / 10)}   ({(pokemonDetails.height / 10).toFixed(1)}m)
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Weight</Text>
                    <Text
                        style={{
                            color: colors.dark,
                        }}
                    >{pokemonDetails?.weight / 10}kg</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Abilities</Text>
                    {pokemonDetails?.pokemon_v2_pokemonabilities.map((ability, index) => (
                        <Text
                            key={ability.pokemon_v2_ability.name}
                            style={{
                                color: colors.dark,
                                marginRight: index !== pokemonDetails.pokemon_v2_pokemonabilities.length - 1 ? 4 : 0,
                                textTransform: 'capitalize',
                            }}
                        >
                            {ability.pokemon_v2_ability.name.toUpperCase()}
                            {index !== pokemonDetails.pokemon_v2_pokemonabilities.length - 1 && ' '}
                        </Text>
                    ))}
                </View>
            </View>

            <View
                style={{
                    marginTop: SPACING * 2,
                    marginBottom: 7.5,
                    paddingHorizontal: SPACING * 2,
                }}
            >
                <Text
                    style={{
                        fontSize: SPACING * 1.5,
                        color: PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || 'transparent',
                        fontWeight: 'bold',
                    }}
                >
                    Training
                </Text>
            </View>

            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Egg Group</Text>
                    {details && details.profile && details.profile.egg ? (
                        <Text style={{ color: colors.light }}>
                            {details.profile.egg.join(", ")}
                        </Text>
                    ) : (
                        <Text style={{ color: colors.light }}>No further egg groups</Text>
                    )}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Base Experience</Text>
                    <Text
                        style={{
                            color: colors.dark,
                            alignSelf: 'center',
                        }}
                    >{pokemonDetails?.base_experience}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Type</Text>
                    <Text
                        style={{
                            color: colors.dark,
                            alignSelf: 'center',
                        }}
                    >
                        {details && details.type && details.type ? (
                            <Text style={{ color: colors.light }}>
                                {details.type.join(", ")}
                            </Text>
                        ) : (
                            <Text style={{ color: colors.light }}>No further egg groups</Text>
                        )}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Gender Rate</Text>
                    <Text
                        style={{
                            color: colors.dark,
                        }}
                    >
                        {details.profile && details.profile.gender ? (
                            <Text style={{ color: colors.light }}>
                                Male ({details.profile.gender.split(':')[0]}%), Female ({details.profile.gender.split(':')[1]}%)
                            </Text>
                        ) : (
                            <Text style={{ color: colors.light }}>Gender ratio not available</Text>
                        )}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Generation</Text>
                    <Text
                        style={{
                            color: colors.dark,
                        }}
                    >
                        {details.generation}
                    </Text>
                </View>
            </View>

        </View>
    )
}



const BaseStats = () => {
    const route = useRoute();
    const name = route.params.pokemonName;
    const { pokeId } = route.params;

    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [details, setDetails] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [pokedexData, setPokedexData] = useState(null);

    const { loading, error, data: detailsData } = useQuery(GET_POKEMON_DETAILS, {
        variables: { name },
    });

    useEffect(() => {
        setPokedexData(Records);
    }, []);

    useEffect(() => {
        if (!pokedexData) {
            return;
        }

        const selectedPokemon = pokedexData.find((record) => record.id === pokeId);

        if (!selectedPokemon) {
            return;
        }

        const evolutionDetails = selectedPokemon.evolution;



        if (evolutionDetails && evolutionDetails.next) {
            [evolutionId, evolutionLevel] = evolutionDetails.next[0];
        }

        setDetails(selectedPokemon);
    }, [pokedexData, pokeId]);

    useEffect(() => {
        if (!loading && !error && detailsData && detailsData.pokemon_v2_pokemon.length > 0) {
            setPokemonDetails(detailsData.pokemon_v2_pokemon[0]);
        }
    }, [detailsData]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setLoading(false);
        }, 1000); // Delay of 3 seconds

        return () => clearTimeout(delay);
    }, []);

    if (isLoading || loading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: 20,
            }}>
                <ActivityIndicator size="large" color={PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || colors.dark} />
            </View>
        );
    }

    let typeColor = PokemonTypesData.find(typeData => typeData.type === pokemonDetails?.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name)?.color || colors.dark;

    if (error) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: 20,
            }}>
                <Text style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: 'black',
                    textAlign: 'center',
                }}>Error fetching Pokemon details.</Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white,
            }}
        >
            <View
                style={{
                    marginTop: SPACING * 2,
                    marginBottom: 7.5,
                    paddingHorizontal: SPACING * 2,
                }}
            >
                <Text
                    style={{
                        fontSize: SPACING * 1.5,
                        color: typeColor,
                        fontWeight: 'bold',
                    }}
                >
                    Base Stats
                </Text>
            </View>
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >HP</Text>
                    <View style={{
                        width: 150,
                        height: 8,
                        backgroundColor: '#F0F0F0',
                        borderRadius: 10,
                        alignSelf: 'center',
                    }}>
                        <View
                            style={[
                                {
                                    width: '50%',
                                    height: 8,
                                    backgroundColor: typeColor,
                                    borderRadius: 10,
                                },
                                {
                                    width: `${(details.base.HP / MAX_BASE_STAT) * 100}%`
                                },
                            ]}
                        />
                    </View>
                    <Text
                        style={{
                            color: colors.dark,
                            marginLeft: SPACING * 2,
                        }}
                    >
                        {pokemonDetails?.pokemon_v2_pokemonstats.find(stat => stat.pokemon_v2_stat.name === 'hp')?.base_stat}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Attack</Text>
                    <View style={{
                        width: 150,
                        height: 8,
                        backgroundColor: '#F0F0F0',
                        borderRadius: 10,
                        alignSelf: 'center',
                    }}>
                        <View
                            style={[
                                {
                                    width: '50%',
                                    height: 8,
                                    backgroundColor: typeColor,
                                    borderRadius: 10,
                                },
                                {
                                    width: `${(details.base.Attack / MAX_BASE_STAT) * 100}%`
                                },
                            ]}
                        />
                    </View>
                    <Text
                        style={{
                            color: colors.dark,
                            marginLeft: SPACING * 2,
                        }}
                    >
                        {pokemonDetails?.pokemon_v2_pokemonstats.find(stat => stat.pokemon_v2_stat.name === 'attack')?.base_stat}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Defense</Text>
                    <View style={{
                        width: 150,
                        height: 8,
                        backgroundColor: '#F0F0F0',
                        borderRadius: 10,
                        alignSelf: 'center',
                    }}>
                        <View
                            style={[
                                {
                                    width: '50%',
                                    height: 8,
                                    backgroundColor: typeColor,
                                    borderRadius: 10,
                                },
                                {
                                    width: `${(details.base.Defense / MAX_BASE_STAT) * 100}%`
                                },
                            ]}
                        />
                    </View>
                    <Text
                        style={{
                            color: colors.dark,
                            marginLeft: SPACING * 2,
                        }}
                    >
                        {pokemonDetails?.pokemon_v2_pokemonstats.find(stat => stat.pokemon_v2_stat.name === 'defense')?.base_stat}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Sp. Attack</Text>
                    <View style={{
                        width: 150,
                        height: 8,
                        backgroundColor: '#F0F0F0',
                        borderRadius: 10,
                        alignSelf: 'center',
                    }}>
                        <View
                            style={[
                                {
                                    width: '50%',
                                    height: 8,
                                    backgroundColor: typeColor,
                                    borderRadius: 10,
                                },
                                {
                                    width: `${(details.base.SpAttack / MAX_BASE_STAT) * 100}%`
                                },
                            ]}
                        />
                    </View>
                    <Text
                        style={{
                            color: colors.dark,
                            marginLeft: SPACING * 2,
                        }}
                    >
                        {pokemonDetails?.pokemon_v2_pokemonstats.find(stat => stat.pokemon_v2_stat.name === 'special-attack')?.base_stat}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Sp. Defense</Text>
                    <View style={{
                        width: 150,
                        height: 8,
                        backgroundColor: '#F0F0F0',
                        borderRadius: 10,
                        alignSelf: 'center',
                    }}>
                        <View
                            style={[
                                {
                                    width: '50%',
                                    height: 8,
                                    backgroundColor: typeColor,
                                    borderRadius: 10,
                                },
                                {
                                    width: `${(details.base.SpAttack / MAX_BASE_STAT) * 100}%`
                                },
                            ]}
                        />
                    </View>
                    <Text
                        style={{
                            color: colors.dark,
                            marginLeft: SPACING * 2,
                        }}
                    >
                        {pokemonDetails?.pokemon_v2_pokemonstats.find(stat => stat.pokemon_v2_stat.name === 'special-defense')?.base_stat}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: 7.5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.dark,
                            fontWeight: 500,
                            width: '30%',
                        }}
                    >Speed</Text>
                    <View style={{
                        width: 150,
                        height: 8,
                        backgroundColor: '#F0F0F0',
                        borderRadius: 10,
                        alignSelf: 'center',
                    }}>
                        <View
                            style={[
                                {
                                    width: '50%',
                                    height: 8,
                                    backgroundColor: typeColor,
                                    borderRadius: 10,
                                },
                                {
                                    width: `${(details.base.Speed / MAX_BASE_STAT) * 100}%`
                                },
                            ]}
                        />
                    </View>
                    <Text
                        style={{
                            color: colors.dark,
                            marginLeft: SPACING * 2,
                        }}
                    >
                        {pokemonDetails?.pokemon_v2_pokemonstats.find(stat => stat.pokemon_v2_stat.name === 'speed')?.base_stat}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SPACING * 2,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginVertical: SPACING * 2,
                    }}
                >
                    <Text
                        style={{
                            color: typeColor,
                            fontWeight: 700,
                            width: '30%',
                            fontSize: 20,
                        }}
                    >Total</Text>
                    <Text
                        style={{
                            color: typeColor,
                            marginLeft: 170,
                            fontWeight: 700,
                            fontSize: 20,
                        }}
                    >
                        {details.base.total}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Pokemon