const { 
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString, 
  GraphQLList
} = require('graphql')

const db = require('../../models/db')
const Bet = require('./bet')

module.exports = {
  Type: new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: {
        type: GraphQLID
      },
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      },
      username: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
      currentBalance: {
        type: GraphQLFloat
      },
      bets: {
        type: new GraphQLList(Bet.Type),
        args: {
          gameId: {
            name: 'gameId',
            type: GraphQLInt
          },
          date: {
            name: 'date',
            type: GraphQLString
          }
        },
        resolve: (user, { gameId, date }) => {
          return new Promise((resolve, reject) => {
            let drawWhere = {}  

            let sql = 'SELECT Bets.* FROM Bets INNER JOIN Draws ON Draws.drawNumber = Bets.drawNumber WHERE Bets.userId = :userId'
            let replacements = {
              userId: user.id
            }


            if (gameId) {
              sql += ' AND Draws.gameId = :gameId'
              replacements.gameId = gameId
            }

            if (date) {
              sql += ` AND Bets.updatedAt >= :startDate AND Bets.updatedAt <= :endDate`
              replacements.startDate = `${date} 00:00:00`
              replacements.endDate = `${date} 23:59:59`
            }

            db.sequelize.query(sql, { 
              replacements: replacements,
              model: db.Bet 
            }).then(bets => {
              resolve(bets)
            }).catch(err => {
              reject(err)
            })
          })
        }
      },
      recentBets: {
        type: new GraphQLList(Bet.Type),
        args: {
          gameId: {
            name: 'gameId',
            type: GraphQLInt
          }
        },
        resolve: (user, { gameId }) => {
          return new Promise((resolve, reject) => {
            let drawWhere = {}  

            if (!gameId) {
              reject('gameId is required')
            }

            db.sequelize.query('SELECT Bets.* FROM Bets INNER JOIN Draws ON Draws.drawNumber = Bets.drawNumber WHERE Bets.userId = :userId AND Draws.gameId = :gameId ORDER BY Bets.updatedAt DESC OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY', { 
              replacements: {
                userId: user.id,
                gameId: gameId
              },
              model: db.Bet 
            }).then(bets => {
              resolve(bets)
            }).catch(err => {
              reject(err)
            })
          })
        }
      },
      createdAt: {
        type: GraphQLString
      },
      updatedAt: {
        type: GraphQLString
      }
    })
  }),

  Input: new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      },
      username: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    }
  })
}