import { toNano } from '@ton/core';
import { Likes } from '../wrappers/Likes';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const likes = provider.open(
        Likes.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Likes')
        )
    );

    await likes.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(likes.address);

    console.log('ID', await likes.getID());
}
