import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomModal from "../../generic/Modal";
import CustomAlert from "../../generic/CustomAlert";
import { useContext } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const WorkDetails = () => {
    const [work, setWork] = useState({});
    const [tasks, setTasks] = useState([]);
    const [flag, setFlag] = useState(true);
    const [status, setStatus] = useState(undefined);
    const [variant, setVariant] = useState("danger");
    const [collaborators, setCollaborators] = useState([]);

    const { handleLogOut } = useContext(AuthenticationContext);

    const params = useParams();

    useEffect(() => {
        let API_URL = "/api/v1/work/details/" + params.id;

        const loadData = async () => {
            let response = await fetch(API_URL, {
                method: "GET",
            });

            if (response.status === 401) handleLogOut();

            let data = await response.json();

            if (!response.ok) setStatus(data.detail);
            setWork(data[0]);

            API_URL = "/api/v1/work/list/collaborator/details/" + params.id;

            response = await fetch(API_URL, {
                method: "GET",
            });

            data = await response.json();

            if (!response.ok) setStatus(data.detail);
            setCollaborators(data);

            API_URL = `/api/v1/${params.id}/task/list/`;

            response = await fetch(API_URL, {
                method: "GET",
            });

            data = await response.json();

            if (response.status !== 404) setTasks(data);
        };

        loadData();
    }, [params.id, flag, handleLogOut]);

    const removeCollaborator = (collaborator) => {
        const API_URL = `/api/v1/work/remove/collaborator/${params.id}/${collaborator}`;

        const loadData = async () => {
            const response = await fetch(API_URL, {
                method: "PATCH",
            });

            const data = await response.json();

            if (!response.ok) setStatus(data.detail);
            else {
                setFlag(!flag);
                setStatus(
                    `You have successfully removed ${collaborator} from collaborator's list.`
                );
                setVariant("success");
            }
        };

        loadData();
    };

    return (
        <Container className="vertical-center">
            <div
                className="col ccard p-4 text-center bg-main-bg"
                style={{ maxWidth: "28rem" }}
            >
                <div className="mb-3">
                    <h5>
                        <b>{work.title}</b>
                    </h5>

                    <Link to={"/work/update/" + work.id}>
                        <FontAwesomeIcon
                            className="mr-1"
                            icon={["fas", "edit"]}
                        />
                        Edit
                    </Link>
                </div>

                {status && <CustomAlert variant={variant} status={status} />}

                <div className="mb-3">
                    <b>Status: </b>
                    {work.completed ? "Completed" : "Incomplete"}
                    <br />

                    <b>Task Count: </b>
                    {tasks.length}
                    <br />

                    <b>Owner: </b>
                    {collaborators.map((collaborator) => {
                        if (collaborator.pk === work.owner) {
                            return (
                                <Link
                                    key={collaborator.pk}
                                    to={`/profile/${params.id}/${collaborator.pk}`}
                                >
                                    {collaborator.username}
                                </Link>
                            );
                        }
                        return undefined;
                    })}
                </div>

                <b>Collaborators: </b>
                {collaborators.map((collaborator) => (
                    <div key={collaborator.pk} className="mt-2">
                        <Button
                            size="sm"
                            as={Link}
                            to={`/profile/${params.id}/${collaborator.pk}`}
                            className="mr-2"
                            variant="outline-primary"
                        >
                            {collaborator.username}
                        </Button>

                        {parseInt(localStorage.getItem("userID")) ===
                            work.owner && (
                            <CustomModal
                                modalTitle="Delete"
                                actionButtonSize="sm"
                                actionVariant="danger"
                                variant="outline-danger"
                                handleAction={() =>
                                    removeCollaborator(collaborator.username)
                                }
                                modalBody={`Do you really want to remove "${collaborator.username}" from "${work.title}" work's collaboration?`}
                            >
                                <FontAwesomeIcon icon={["fas", "user-slash"]} />
                            </CustomModal>
                        )}
                    </div>
                ))}

                {parseInt(localStorage.getItem("userID")) === work.owner && (
                    <div className="mt-3" style={{ fontSize: "0.95rem" }}>
                        <Link to={`/add/collaborator/${params.id}`}>
                            <FontAwesomeIcon
                                className="mr-1"
                                icon={["fas", "user-plus"]}
                            />
                            Add Collaborator
                        </Link>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default WorkDetails;
