import { BIGCOMMERCE_API_URL } from "~/constants";

interface AppExtensionResponse {
  data: {
    store: {
      appExtensions: {
        edges: { node: { id: string; } }[];
      }
    }
  }
};

interface AppExtensionProps {
  accessToken: string;
  storeHash: string;
}

export const createAppExtension = async ({ accessToken, storeHash }: AppExtensionProps) => {
  const response = await fetch(
    `https://${BIGCOMMERCE_API_URL}/stores/${storeHash}/graphql`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-auth-token": accessToken,
      },
      body: JSON.stringify(createAppExtensionMutation()),
    }
  );

  const { errors } = await response.json();

  if (errors && errors.length > 0) {
    throw new Error(errors[0]?.message);
  }
}

export const getAppExtensions = async ({ accessToken, storeHash }: AppExtensionProps) => {
  const response = await fetch(
    `https://${BIGCOMMERCE_API_URL}/stores/${storeHash}/graphql`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-auth-token": accessToken,
      },
      body: JSON.stringify(getAppExtensionsQuery()),
    }
  );

  const { data: { store: { appExtensions } } }: AppExtensionResponse = await response.json();

  return appExtensions.edges;
}

const getAppExtensionsQuery = () => ({
  query: `
      query {
          store {
              appExtensions {
                  edges {
                      node {
                          id
                      }
                  }
              }
          }
      }`,
});

const createAppExtensionMutation = () => ({
  query: `
      mutation AppExtension($input: CreateAppExtensionInput!) {
          appExtension {
              createAppExtension(input: $input) {
              appExtension {
                    id
                    context
                    model
                    url
                    label {
                       defaultValue
                       locales {
                        value
                        localeCode
                      }
                    }
                  }
              }
          }
      }`,
  variables: {
    input: {
      context: 'PANEL',
      model: 'PRODUCT_DESCRIPTION',
      url: '/productDescription/${id}',
      label: {
        defaultValue: 'Generate text', locales: [
          {
            value: 'Generate text',
            localeCode: 'en-US',
          }
        ],
      },
    },
  },
});
