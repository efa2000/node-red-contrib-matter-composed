import { Endpoint, Environment, ServerNode, StorageService, Time, VendorId } from "@matter/main";
import { BridgedDeviceBasicInformationServer } from "@matter/main/behaviors/bridged-device-basic-information";
import { AggregatorEndpoint } from "@matter/main/endpoints/aggregator";

import { OnOffLightDevice } from "@matter/main/devices/on-off-light";
import { OnOffPlugInUnitDevice } from "@matter/main/devices/on-off-plug-in-unit";

/** Initialize configuration values */
const config = {
    port: 5540,
    passcode: genPasscode(),
    discriminator: +Math.floor(Math.random() * 4095).toString().padStart(4, '0'),
    deviceName: "MatterJS",
    vendorName: "MatterJS",
    vendorId: 0xFFF3,
    productName: "MatterJS",
    productId: 0x8000,
    uniqueId: "12342343423",
    isSocket: false,
};

const { isSocket, deviceName, vendorName, passcode, discriminator, vendorId, productName, productId, port, uniqueId } = config;

/**
 * Create a Matter ServerNode, which contains the Root Endpoint and all relevant data and configuration
 */
const server = await ServerNode.create({
    // Required: Give the Node a unique ID which is used to store the state of this node
    id: uniqueId,

    // Provide Network relevant configuration like the port
    // Optional when operating only one device on a host, Default port is 5540
    network: {
        port,
    },

    // Provide Commissioning relevant settings
    // Optional for development/testing purposes
    commissioning: {
        passcode,
        discriminator,
    },

    // Provide Node announcement settings
    // Optional: If Ommitted some development defaults are used
    productDescription: {
        name: deviceName,
        deviceType: AggregatorEndpoint.deviceType,
    },

    // Provide defaults for the BasicInformation cluster on the Root endpoint
    // Optional: If Omitted some development defaults are used
    basicInformation: {
        vendorName,
        vendorId: VendorId(vendorId),
        nodeLabel: productName,
        productName,
        productLabel: productName,
        productId,
        serialNumber: `matterjs-${uniqueId}`,
        uniqueId,
    },
});

const aggregator = new Endpoint(AggregatorEndpoint, { id: "aggregator" });
await server.add(aggregator);

await server.start();





function genPasscode(){
    let x = Math.floor(Math.random() * (99999998-1) +1)
    const invalid = [11111111,22222222,33333333,44444444,55555555,66666666,77777777,88888888,12345678,87654321]
    if (invalid.includes(x)){
        x += 1
    }
    let xx =  x.toString().padStart(8, '0')
    return +xx
}