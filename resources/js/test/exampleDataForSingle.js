const expectedDataVideoFrame = {
    videoObj: {
        video: {
            created_at: "2024-04-15T20:45:19.000000Z",
            id: 5,
            reference_code: "1a7ULotn5s",
            thumbnail: "/storage/videos/1a7ULotn5spalic001.jpg",
            updated_at: "2024-04-15T20:45:19.000000Z",
            user_id: 1,
            video: "/storage/videos/1a7ULotn5spalic.mp4",
            visibility: "Public",
        },
        title: "fsdfsd",
        userAvatar: null,
        userFirstName: "Piotr",
        userName: "piotrkozielec9956",
        tags: [
            {
                id: 11,
                name: "fsdfsd",
                created_at: "2024-04-15T20:45:19.000000Z",
                updated_at: "2024-04-15T20:45:19.000000Z",
            },
        ],
        likesCount: 1,
        dislikesCount: 0,
        description: "opis filmu",
    },
    isLoading: false,
};

const expectedDataVideo = {
    id: 1,
    reference_code: "KQ5OQMHw9o",
    thumbnail:
        "/storage/videos/KQ5OQMHw9oGothic-OBRAZ-80x60-plakat-gra-canvas-3-2-4.jfif",
    video: "/storage/videos/KQ5OQMHw9opalic.mp4",
    views: 0,
    avatar: null,
    created_at: "2024-04-17T10:18:19.000000Z",
    dislikesCount: 1,
    firstName: "wyniotonator9707",
    languages: [
        {
            id: 1,
            name: "English",
            created_at: null,
            updated_at: null,
            pivot: {
                video_id: 1,
                language_id: 1,
                title: "Gothic",
                description: "Gothic piosenka",
            },
        },
    ],
    likesCount: 3,
    status: "Ok",
    tags: [
        {
            id: 1,
            name: "gothic",
            created_at: "2024-04-17T10:18:19.000000Z",
            updated_at: "2024-04-17T10:18:19.000000Z",
            pivot: {},
        },
        {
            id: 2,
            name: "rpg",
            created_at: "2024-04-17T10:18:19.000000Z",
            updated_at: "2024-04-17T10:18:19.000000Z",
            pivot: {},
        },
        {
            id: 3,
            name: "gothic1",
            created_at: "2024-04-17T10:18:19.000000Z",
            updated_at: "2024-04-17T10:18:19.000000Z",
            pivot: {},
        },
    ],
    updated_at: "2024-04-17T10:18:19.000000Z",
    userName: "wyniotonator9707",
    user_id: 1,
    visibility: "Public",
};

export { expectedDataVideo, expectedDataVideoFrame };
