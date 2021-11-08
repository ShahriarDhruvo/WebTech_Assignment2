import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CustomAlert from "../../generic/CustomAlert";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const AddCollaborator = (props) => {
    const [status, setStatus] = useState(undefined);
    const [variant, setVariant] = useState(undefined);

    const { handleLogOut } = useContext(AuthenticationContext);

    const params = useParams();

    useEffect(() => {
        let API_URL = "/api/v1/work/list/";

        const loadData = async () => {
            let response = await fetch(API_URL, {
                method: "GET",
            });

            if (response.status === 401) handleLogOut();
        };

        loadData();
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const collaboratorName = e.target.newCollaborator.value;

        if (collaboratorName === "") return setStatus("Field cannot be empty");

        const API_URL = `/api/v1/work/add/collaborator/${params.id}/${collaboratorName}`;

        const loadData = async () => {
            try {
                const response = await fetch(API_URL, {
                    method: "PATCH",
                });

                const data = await response.json();

                if (response.status === 404) {
                    setVariant("danger");
                    setStatus(data.detail);
                } else if (response.status === 409) {
                    setVariant("info");
                    setStatus(data.detail);
                } else if (response.status === 403) {
                    setVariant("warning");
                    setStatus(data.detail);
                } else if (response.status === 200) {
                    setVariant("success");
                    setStatus(
                        `You have added ${collaboratorName} as a collaborator for this work`
                    );
                }
            } catch (error) {
                setStatus(error);
            }
        };

        loadData();
        document.getElementById("collaborator-form").reset();
    };

    return (
        <Container className="vertical-center">
            <div
                className="col ccard p-4 text-center bg-main-bg"
                style={{ maxWidth: "28rem" }}
            >
                <h5 className="clogo mb-5">Add a Collaborator for this work</h5>

                <Form id="collaborator-form" onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        {status && (
                            <CustomAlert variant={variant} status={status} />
                        )}

                        <div className="d-flex mt-4">
                            <input
                                required
                                type="text"
                                name="newCollaborator"
                                placeholder="Collaborator's Name..."
                                onChange={() => setStatus("")}
                                className="ccard__input pl-2"
                            />
                        </div>

                        <Form.Text className="text-muted">
                            Collaborator's can read and edit this work
                            information
                        </Form.Text>
                    </Form.Group>

                    <div className="mt-4 d-flex justify-content-around">
                        <Button
                            size="sm"
                            variant="main"
                            type="submit"
                            className="my-2"
                            style={{ minWidth: "7rem" }}
                        >
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={["fas", "user-plus"]}
                            />
                            Add
                        </Button>

                        <Button
                            size="sm"
                            variant="outline-main"
                            className="my-2"
                            style={{ minWidth: "7rem" }}
                            onClick={() => props.history.goBack()}
                        >
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={["fa", "chevron-left"]}
                            />
                            Go Back
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default AddCollaborator;
