import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  dirs: Array<Scalars['String']>;
};


export type QueryDirsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']>;
  root: Scalars['String'];
};

export type GetDirsQueryVariables = Exact<{
  root: Scalars['String'];
}>;


export type GetDirsQuery = { __typename?: 'Query', dirs: Array<string> };


export const GetDirsDocument = gql`
    query getDirs($root: String!) {
  dirs(root: $root)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getDirs(variables: GetDirsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetDirsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDirsQuery>(GetDirsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getDirs', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;