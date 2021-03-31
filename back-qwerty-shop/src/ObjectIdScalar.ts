// import { Scalar } from '@nestjs/graphql';
// import { Kind, ASTNode } from 'graphql';
// import { Types } from 'mongoose';

// @Scalar('MongoObjectId')
// export class ObjectIdScalar {
//     description = 'Mongo object id scalar type';

//     parseValue(value: string) {
//         return new Types.ObjectId(value); // value from the client
//     }

//     serialize(value: Types.ObjectId) {
//         return value.toHexString(); // value sent to the client
//     }

//     parseLiteral(ast: ASTNode) {
//         if (ast.kind === Kind.STRING) {
//             return new Types.ObjectId(ast.value); // value from the client query
//         }
//         return null;
//     }
// }