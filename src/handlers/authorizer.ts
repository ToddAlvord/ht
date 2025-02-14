import type {
	APIGatewayRequestAuthorizerEventV2,
	APIGatewaySimpleAuthorizerResult,
} from "aws-lambda";

export const handler = async (
	event: APIGatewayRequestAuthorizerEventV2,
): Promise<APIGatewaySimpleAuthorizerResult> => {
	const token = event.headers?.authorization || "";

	if (token === "123ABC") {
		return {
			isAuthorized: true,
		};
	}

	return {
		isAuthorized: false,
	};
};
