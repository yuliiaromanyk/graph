const { ApolloServer, gql } = require('apollo-server');

//---------------data ------------------

const Playlist_full = [{
  id: 1,
  playlistName: 'fun',
  genre:  'Falk',
  tracks: []
},
{
  id: 2,
  playlistName: 'sad',
  genre:  'Pop',
  tracks: []
}
]


const Track_full = [{
  id: 10001,
  trackName: 'Hello',
  bandName: 'Rihanna',
  starsCount: '4',
  playlist: Playlist_full[0]
},
{
  id: 10002,
  trackName: 'Kiss',
  bandName: 'Katty Perry',
  starsCount: '2',
  playlist: Playlist_full[1]
}]

Playlist_full[0].tracks.push(Track_full[0]);

const typeDefs = gql `

schema {
  query: Query
  mutation: Mutation
} 

  # -------------------------main types------------------------------------
  type Playlist {
    id: ID!
    playlistName: String!
    genre: [Genre_list]
    tracks: [Track]
  }
  type Track {
    id: ID!
    trackName: String!
    bandName: String
    starsCount: String
    playlist: Playlist!
  }
  # -------------------------Query type------------------------------------
  type Query {
    playlist(id:Int!): Playlist
    track(id:Int!): Track
    playlists: [Playlist]
    tracks: [Track]
  }

  # ------------------------Mutaiton type------------------------------------
  type Mutation {
    createPlaylist(input: PlaylistInput!): Playlist
    createTrack(input: TrackInput!): Track
  }

  # ------------------------define inputs for mut.------------------------------------
  input PlaylistInput{
    id: Int!
    playlistName: String!
    genre: Genre_list!
  }
  input TrackInput{
    id: Int!
    trackName: String!
    bandName: String!
    starsCount: String
    playlist: Int!
  }
  # ------------------------define genres.------------------------------------
  enum Genre_list {
    Pop
    Falk
    Jazz
    RocknRoll
    Techno
  }

`;


const resolvers = {
  Query: {
      
      playlist: (root, {id}, context) => {
        return Playlist_full.find(playlist => playlist.id === id);
      },
      playlists: () => Playlist_full,

      track: (root, {id}, context) => {
      return Track_full.find(track => track.id === id);
      },

      tracks: () => Track_full, 
  
  },

  Mutation: {
    createPlaylist: (root, args, context) => {
      const newPlaylist = {
      id:args.input.id,
      playlistName: args.input.playlistName,
      genre: args.input.genre,
      tracks: []
      }
      Playlist_full.push(newPlaylist);
      return newPlaylist;
  },
  createTrack: (root, args, context) => {
    const newTrack = {
    id:args.input.id,
    trackName: args.input.trackName,
    bandName: args.input.bandName,
    starsCount: args.input.starsCount,
    }
    Track_full.push(newTrack);
    return newTrack;
  }

}

}



const server = new ApolloServer({
    typeDefs,
    resolvers
})


server.listen().then(({
    url
}) => {
    console.log(`Running at ${url}`);
})
